using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading;
using System.Windows.Automation;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Window;

namespace NinjaTraderAutomation
{
    public static class NinjaTraderActionExecute
    {
        private const string NinjaTraderProcessName = "NinjaTrader";
        private const string NinjaTraderWelcomeTitle = "Welcome";
        private const string NinjaTraderMainWindowTitle = "Control Center - Accounts";
        private const string NinjaTraderChartWindowTitlePrefix = "Chart - ";
        private const string NinjaTraderBasicEntryTitlePrefix = "Basic Entry - ";
        private const string SimulationMenuItemName = "Simulation";
        private static IntPtr sTraderWindowHandle;
        private static IntPtr sBasicEntryWindowHandle;

        public static event Action<float, float, float> OnResultUpdate;
        public static Process LaunchNinjaTrader(string ninjaTraderName)
        {
            Process[] processes = Process.GetProcessesByName(NinjaTraderProcessName);
            if(processes.Length > 0)
            {
                return processes[0];
            }

            var ninjaTraderProcess = Process.Start(ninjaTraderName);
            while(!NativeApiHelper.IsWindowVisible(ninjaTraderProcess.MainWindowHandle))
            {
                Thread.Sleep(100);
            }

            return ninjaTraderProcess;
        }

        private static bool CloseWindow(IntPtr hwnd)
        {
            if(!NativeApiHelper.IsWindowVisible(hwnd))
            {
                return false;
            }

            var mainWindowElement = AutomationElement.FromHandle(hwnd);
            if(mainWindowElement == null)
            {
                return false;
            }

            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "NTWindowButtonClose", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button, PropertyConditionFlags.None),
                new PropertyCondition(AutomationElement.ClassNameProperty, "Button", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.AcceleratorKeyProperty, "Close", PropertyConditionFlags.IgnoreCase));
            var closeButton = mainWindowElement.FindFirst(TreeScope.Children, condition);
            if (closeButton == null)
            {
                return false;
            }
            if (!closeButton.TryGetCurrentPattern(InvokePattern.Pattern, out object closeButtonPattern))
            {
                return false;
            }
            ((InvokePattern)closeButtonPattern).Invoke();
            return true;
        }

        private static bool MinimizeWindow(IntPtr hwnd)
        {
            var mainWindowElement = AutomationElement.FromHandle(hwnd);
            if (mainWindowElement == null)
            {
                return false;
            }

            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "NTWindowButtonMinimize", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button, PropertyConditionFlags.None),
                new PropertyCondition(AutomationElement.ClassNameProperty, "Button", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.HelpTextProperty, "Minimize", PropertyConditionFlags.IgnoreCase));
            var minimizeButton = mainWindowElement.FindFirst(TreeScope.Children, condition);
            if (minimizeButton == null)
            {
                return false;
            }
            if (!minimizeButton.TryGetCurrentPattern(InvokePattern.Pattern, out object minimizeButtonPattern))
            {
                return false;
            }
            ((InvokePattern)minimizeButtonPattern).Invoke();
            return true;
        }

        public static void Setup(Process ninjaTraderProcess)
        {
            var mainWindowElement = AutomationElement.FromHandle(ninjaTraderProcess.MainWindowHandle);
            if (string.Compare(ninjaTraderProcess.MainWindowTitle, NinjaTraderWelcomeTitle, true) == 0)
            {
                var userName = mainWindowElement.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.AutomationIdProperty, "tbUserName", PropertyConditionFlags.None));
                if (userName != null && userName.TryGetCurrentPattern(ValuePattern.Pattern, out object userNamePattern))
                {
                    ((ValuePattern)userNamePattern).SetValue(AppSettings.Instance.Username);
                }
                var password = mainWindowElement.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.AutomationIdProperty, "passwordBox", PropertyConditionFlags.None));
                if (password != null && password.TryGetCurrentPattern(ValuePattern.Pattern, out object passwordPattern))
                {
                    ((ValuePattern)passwordPattern).SetValue(AppSettings.Instance.Password);
                }
                var login = mainWindowElement.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.AutomationIdProperty, "btnLogin", PropertyConditionFlags.None));
                if (login != null && login.TryGetCurrentPattern(InvokePattern.Pattern, out object loginPattern))
                {
                    ((InvokePattern)loginPattern).Invoke();
                }
                int nCount = 5;
                var simulationButton = mainWindowElement.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.AutomationIdProperty, "btnSimulation", PropertyConditionFlags.None));
                while (simulationButton == null && nCount-- > 0)
                {
                    simulationButton = mainWindowElement.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.AutomationIdProperty, "btnSimulation", PropertyConditionFlags.None));
                    if(simulationButton == null)
                    {
                        Thread.Sleep(1000);
                    }
                }
                if (simulationButton != null && simulationButton.TryGetCurrentPattern(InvokePattern.Pattern, out object simulationButtonPattern))
                {
                    ((InvokePattern)simulationButtonPattern).Invoke();
                }
            }

            int nMaxLoop = 300;

            while (nMaxLoop-- > 0)
            {
                ninjaTraderProcess.Refresh();
                if (!NativeApiHelper.IsWindowVisible(ninjaTraderProcess.MainWindowHandle))
                {
                    Thread.Sleep(100);
                    continue;
                }

                if (string.Compare(ninjaTraderProcess.MainWindowTitle, NinjaTraderMainWindowTitle, StringComparison.OrdinalIgnoreCase) != 0)
                {
                    Thread.Sleep(100);
                    continue;
                }

                break;
            }
            if (nMaxLoop <= 0)
            {
                MessageBox.Show("Failed to locate Account Center window.");
                return;
            }
            NativeApiHelper.SetForegroundWindow(ninjaTraderProcess.MainWindowHandle);

            mainWindowElement = AutomationElement.FromHandle(ninjaTraderProcess.MainWindowHandle);
            if(SetupConnection(mainWindowElement))
            {
                FindTraderWindow(ninjaTraderProcess, out IntPtr hTrader, out IntPtr hBasicEntry);
                if(!NativeApiHelper.IsWindowVisible(hBasicEntry))
                {
                    SetupBasicEntryWindow(mainWindowElement);
                    FindTraderWindow(ninjaTraderProcess, out hTrader, out hBasicEntry);
                }
                sTraderWindowHandle = hTrader;
                sBasicEntryWindowHandle = hBasicEntry;
                MinimizeWindow(ninjaTraderProcess.MainWindowHandle);
                if(NativeApiHelper.IsWindowVisible(sBasicEntryWindowHandle))
                {
                    NativeApiHelper.SetWindowPos(sBasicEntryWindowHandle, 0, 0, 0, 1200, 800, NativeApiHelper.SWP_NOZORDER | NativeApiHelper.SWP_SHOWWINDOW);
                    NativeApiHelper.SetForegroundWindow(sBasicEntryWindowHandle);
                    Thread.Sleep(1000);
                    var traderWindowElement = AutomationElement.FromHandle(sBasicEntryWindowHandle);
                    if(traderWindowElement != null)
                    {
                        if(!SetupChartWindow(traderWindowElement))
                        {
                            MessageBox.Show("Failed to setup the Ninja Trader. Pls manually do it.");
                        }
                    }
                }
            }
        }

        private static void IsTraderWindow(IntPtr hWnd, int processId, ref bool isTrader, ref bool isBasicEntry)
        {
            isTrader = false;
            isBasicEntry = false;
            if(!NativeApiHelper.IsWindowVisible(hWnd))
            {
                return;
            }
            NativeApiHelper.GetWindowThreadProcessId(hWnd, out int pid);
            if(pid != processId)
            {
                return;
            }

            StringBuilder title = new StringBuilder(NativeApiHelper.GetWindowTextLength(hWnd) + 1);
            NativeApiHelper.GetWindowText(hWnd, title, title.Capacity);
            string windowTitle = title.ToString();
            isTrader = windowTitle.StartsWith(NinjaTraderChartWindowTitlePrefix, StringComparison.InvariantCulture);
            isBasicEntry = windowTitle.StartsWith(NinjaTraderBasicEntryTitlePrefix, StringComparison.InvariantCulture);
            if(!isTrader && !isBasicEntry && string.Compare(NinjaTraderMainWindowTitle, windowTitle, StringComparison.InvariantCultureIgnoreCase) != 0)
            {
                CloseWindow(hWnd);
            }
        }

        private static void FindTraderWindow(Process ninjaTraderProcess, out IntPtr hTraderWnd, out IntPtr hBasicEntryWnd)
        {
            IntPtr hTrader = IntPtr.Zero;
            IntPtr hBasicEntry = IntPtr.Zero;
            NativeApiHelper.EnumWindows(delegate(IntPtr hwnd, IntPtr processId) 
            {
                bool isTrader = false, isBasicEntry = false;
                IsTraderWindow(hwnd, (int)processId, ref isTrader, ref isBasicEntry);
                if (isTrader && hTrader == IntPtr.Zero)
                {
                    hTrader = hwnd;
                }
                else if(isBasicEntry && hBasicEntry == IntPtr.Zero)
                {
                    hBasicEntry = hwnd;
                }
                return true;
            }, (IntPtr)ninjaTraderProcess.Id);
            hTraderWnd = hTrader;
            hBasicEntryWnd = hBasicEntry;
        }

        private static bool SetupConnection(AutomationElement mainWindowElement)
        {
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ControlCenterMenuItemConnections", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.MenuItem, PropertyConditionFlags.None)
                );
            var connectionMenuItem = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if (connectionMenuItem != null)
            {
                if (connectionMenuItem.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out object connectionMenuItemPattern))
                {
                    ((ExpandCollapsePattern)connectionMenuItemPattern).Expand();
                    var menuItem = TreeWalker.ControlViewWalker.GetFirstChild(connectionMenuItem);
                    while(menuItem != null && string.Compare(menuItem.Current.Name, AppSettings.Instance.ConnectionName, StringComparison.InvariantCultureIgnoreCase) != 0)
                    {
                        menuItem = TreeWalker.ControlViewWalker.GetNextSibling(menuItem);
                    }
                    if(menuItem != null)
                    {
                        if (menuItem.TryGetCurrentPattern(InvokePattern.Pattern, out object simulationMenuItemPattern))
                        {
                            ((InvokePattern)simulationMenuItemPattern).Invoke();
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private static bool SetupAccount(AutomationElement mainWindowElement, TradeOptions option)
        {
            string accountName = option == TradeOptions.BuysGoLong ? AppSettings.Instance.BuyLongAccountName : AppSettings.Instance.SellShortAccountName;
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartTraderControlAccountSelector", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.ComboBox, PropertyConditionFlags.None)
                );
            var accountSelectorCombo = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if(accountSelectorCombo != null)
            {
                if (accountSelectorCombo.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out object accountSelectorComboPattern))
                {
                    ((ExpandCollapsePattern)accountSelectorComboPattern).Expand();
                    var listItem = TreeWalker.ControlViewWalker.GetFirstChild(accountSelectorCombo);
                    while(listItem != null && string.Compare(listItem.Current.Name, accountName, StringComparison.InvariantCultureIgnoreCase) != 0)
                    {
                        listItem = TreeWalker.ControlViewWalker.GetNextSibling(listItem);
                    }
                    if(listItem != null)
                    {
                        if(listItem.TryGetCurrentPattern(SelectionItemPattern.Pattern, out object accountListItemSelectPattern))
                        {
                            ((SelectionItemPattern)accountListItemSelectPattern).Select();
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private static bool IsMatchStrategyNameMatch(string expectName, AutomationElement listItem)
        {
            var firstChild = TreeWalker.ControlViewWalker.GetFirstChild(listItem);
            if(firstChild != null)
            {
                var strategyName = TreeWalker.ControlViewWalker.GetNextSibling(firstChild);
                return strategyName != null && string.Compare(strategyName.Current.Name, expectName, StringComparison.InvariantCultureIgnoreCase) == 0;
            }

            return false;
        }

        private static bool SetupStragegy(AutomationElement mainWindowElement, TradeOptions option)
        {
            string strategyName = option == TradeOptions.BuysGoLong ? AppSettings.Instance.StrategyBuyLongName : AppSettings.Instance.StragegySellShortName;
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartTraderControlATMStrategySelector", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.ComboBox, PropertyConditionFlags.None)
                );
            var strategySelectorCombo = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if (strategySelectorCombo != null)
            {
                if (strategySelectorCombo.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out object strategySelectorComboPattern))
                {
                    ((ExpandCollapsePattern)strategySelectorComboPattern).Expand();
                    var listItem = TreeWalker.ControlViewWalker.GetFirstChild(strategySelectorCombo);
                    while (listItem != null && !IsMatchStrategyNameMatch(strategyName, listItem))
                    {
                        listItem = TreeWalker.ControlViewWalker.GetNextSibling(listItem);
                    }
                    if (listItem != null)
                    {
                        if (listItem.TryGetCurrentPattern(SelectionItemPattern.Pattern, out object strategyListItemSelectPattern))
                        {
                            ((SelectionItemPattern)strategyListItemSelectPattern).Select();
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private static bool ExecuteTrade(AutomationElement mainWindowElement, TradeOptions option)
        {
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, option == TradeOptions.BuysGoLong ? "ChartTraderControlQuickBuyMarketButton" : "ChartTraderControlQuickSellMarketButton", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button, PropertyConditionFlags.None)
                );
            var tradeButton = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if(tradeButton != null && tradeButton.TryGetCurrentPattern(InvokePattern.Pattern, out object tradeInvokePattern))
            {
                ((InvokePattern)tradeInvokePattern).Invoke();
                return true;
            }

            return false;
        }

        private static bool sMonitoring = false;

        private static void MonitorTradeTransaction(AutomationElement mainWindowElement, TradeOptions option)
        {
            var condition = new AndCondition(
            new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartTraderControlPositionQuantityText", PropertyConditionFlags.IgnoreCase),
            new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text, PropertyConditionFlags.None)
            );

            var tradeCountElement = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            condition = new AndCondition(
            new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartTraderControlAvgEntryPriceText", PropertyConditionFlags.IgnoreCase),
            new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text, PropertyConditionFlags.None)
            );
            var tracePriceElement = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            condition = new AndCondition(
            new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartTraderControlPnLText", PropertyConditionFlags.IgnoreCase),
            new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text, PropertyConditionFlags.None)
            );
            var tradeProfitElement = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            sMonitoring = true;
            float lastTradeCount = 0, lastTradePrice = 0, lastTradeProfit = 0;
            DateTime lastUpdate = DateTime.Now;
            while (sMonitoring && NativeApiHelper.IsWindowVisible(sTraderWindowHandle))
            {
                if(float.TryParse(tradeCountElement.Current.Name, out float currentTradeCount)
                    && float.TryParse(tracePriceElement.Current.Name, out float currentTradePrice)
                    && float.TryParse(tradeProfitElement.Current.Name, out float currentTradeProfit))
                {
                    if(currentTradeCount != lastTradeCount
                        || currentTradePrice != lastTradePrice
                        || currentTradeProfit != lastTradeProfit)
                    {
                        lastUpdate = DateTime.Now;
                        lastTradeCount = currentTradeCount;
                        lastTradePrice = currentTradePrice;
                        lastTradeProfit = currentTradeProfit;
                        if(OnResultUpdate != null)
                        {
                            OnResultUpdate(currentTradeCount, currentTradePrice, currentTradeProfit);
                        }
                    }
                }
                if ((DateTime.Now - lastUpdate).TotalSeconds > 60)
                {
                    break;
                }
                Thread.Sleep(100);
            }
        }

        private static void CloseTradeSession(AutomationElement mainWindowElement)
        {
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartTraderControlQuickCloseButton", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button, PropertyConditionFlags.None)
                );
            var closeTradeButton = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if (closeTradeButton != null && closeTradeButton.TryGetCurrentPattern(InvokePattern.Pattern, out object tradeCloseInvokePattern))
            {
                ((InvokePattern)tradeCloseInvokePattern).Invoke();
            }
            sMonitoring = false;
        }

        public static void ProcessCommand(TradeCommand command)
        {
            if(command.TradeOption == TradeOptions.None || !NativeApiHelper.IsWindowVisible(sTraderWindowHandle))
            {
                return;
            }

            var traderWindowElement = AutomationElement.FromHandle(sTraderWindowHandle);
            if (traderWindowElement == null)
            {
                return;
            }
            if(command.TradeOption == TradeOptions.Close)
            {
                CloseTradeSession(traderWindowElement);
                return;
            }

            if(SetupAccount(traderWindowElement, command.TradeOption)
                && SetupStragegy(traderWindowElement, command.TradeOption))
            {
                if(ExecuteTrade(traderWindowElement, command.TradeOption))
                {
                    MonitorTradeTransaction(traderWindowElement, command.TradeOption);
                }
            }
        }

        private static bool SetupBasicEntryWindow(AutomationElement mainControlCenterElement)
        {
            if(mainControlCenterElement == null)
            {
                return false;
            }

            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ControlCenterMenuItemNew", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.MenuItem, PropertyConditionFlags.None)
                );
            var newMenuItem = mainControlCenterElement.FindFirst(TreeScope.Descendants, condition);
            if (newMenuItem == null)
            {
                return false;
            }
            if (!newMenuItem.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out object newMenuItemPattern))
            {
                return false;
            }

            ((ExpandCollapsePattern)newMenuItemPattern).Expand();
            condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ControlCenterMenuItemNewBasicEntry", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.MenuItem, PropertyConditionFlags.None)
                );
            var basicEntryMenuItem = mainControlCenterElement.FindFirst(TreeScope.Descendants, condition);
            if (basicEntryMenuItem == null)
            {
                return false;
            }
            if (!basicEntryMenuItem.TryGetCurrentPattern(InvokePattern.Pattern, out object invokeMenuItemPattern))
            {
                return false;
            }
            ((InvokePattern)invokeMenuItemPattern).Invoke();
            return true; 
        }

        private static bool SetupChartWindow(AutomationElement mainWindowElement)
        {
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartWindowInstrumentSelectorMenuItem", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.MenuItem, PropertyConditionFlags.None)
                );
            var instrumentMenuItem = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if (instrumentMenuItem == null)
            {
                return false;
            }
            if (!instrumentMenuItem.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out object instrumentMenuItemPattern))
            { 
                return false; 
            }

            ((ExpandCollapsePattern)instrumentMenuItemPattern).Expand();
            Thread.Sleep(100);
            condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, AppSettings.Instance.InstrumentAutoId, PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.MenuItem, PropertyConditionFlags.None));
            var selectedInstrument = instrumentMenuItem.FindFirst(TreeScope.Children, condition);
            if (selectedInstrument == null)
            {
                return false;
            }
            if (!selectedInstrument.TryGetCurrentPattern(InvokePattern.Pattern, out object simulationMenuItemPattern))
            {
                return false;
            }
            ((InvokePattern)simulationMenuItemPattern).Invoke();
            condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "ChartWindowIntervalSelector", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Custom, PropertyConditionFlags.None),
                new PropertyCondition(AutomationElement.ClassNameProperty, "IntervalSelector", PropertyConditionFlags.IgnoreCase));
            var selectInterval = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if(selectInterval == null)
            {
                return false;
            }

            var toggleButton = TreeWalker.ControlViewWalker.GetLastChild(selectInterval);

            if(toggleButton == null)
            {
                return false;
            }

            if (!toggleButton.TryGetCurrentPattern(TogglePattern.Pattern, out object toggleButtonPattern))
            {
                return false;
            }
            ((TogglePattern)toggleButtonPattern).Toggle();
            condition = new AndCondition(
                new PropertyCondition(AutomationElement.AutomationIdProperty, "intervalsDisplay", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Custom, PropertyConditionFlags.None),
                new PropertyCondition(AutomationElement.ClassNameProperty, "intervalsDisplay", PropertyConditionFlags.IgnoreCase));
            var customDisplay = mainWindowElement.FindFirst(TreeScope.Descendants, condition);
            if (customDisplay == null)
            {
                return false;
            }
            condition = new AndCondition(
                new PropertyCondition(AutomationElement.NameProperty, "Minute", PropertyConditionFlags.IgnoreCase),
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text, PropertyConditionFlags.None),
                new PropertyCondition(AutomationElement.ClassNameProperty, "TextBlock", PropertyConditionFlags.IgnoreCase));
            var minuteText = customDisplay.FindFirst(TreeScope.Children, condition);
            if(minuteText == null)
            {
                return false;
            }
            var onebutton = TreeWalker.ControlViewWalker.GetNextSibling(minuteText);
            if (onebutton == null)
            {
                return false;
            }
            if (!onebutton.TryGetCurrentPattern(InvokePattern.Pattern, out object oneButtonPattern))
            {
                return false;
            }
            ((InvokePattern)oneButtonPattern).Invoke(); 
            return true;
        }
    }
}
