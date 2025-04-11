using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NinjaTraderAutomation
{
    public partial class Form1 : Form
    {
        LocalServer _locServer;
        public Form1()
        {
            InitializeComponent();
            _locServer = new LocalServer();
            _locServer.OnReceiveRequest += _locServer_OnReceiveRequest;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            this._txtAppPath.Text = AppSettings.Instance.AppPath;
            this._txtUsername.Text = AppSettings.Instance.Username;
            this._txtPassword.Text = AppSettings.Instance.Password.ToString();
            this._txtInstrumentName.Text = AppSettings.Instance.InstrumentAutoId;
            this._txtInstrumentAlert.Text = AppSettings.Instance.InstrumentAlert;
            this._txtConnectionName.Text = AppSettings.Instance.ConnectionName;
            this._txtBuyAlertStart.Text = AppSettings.Instance.BuyAlertStart;
            this._txtSellAlertStart.Text = AppSettings.Instance.SellAlertStart;
            this._txtBuyLong.Text = AppSettings.Instance.BuyLongAccountName;
            this._txtSellShort.Text = AppSettings.Instance.SellShortAccountName;
            this._txtStrategyBuyLong.Text = AppSettings.Instance.StrategyBuyLongName;
            this._txtStrategySellShort.Text = AppSettings.Instance.StragegySellShortName;
            this._txtLocalIpAddress.Text = AppSettings.Instance.LocalIpAddress;
            NinjaTraderActionExecute.OnResultUpdate += NinjaTraderActionExecute_OnResultUpdate;
            OpenTradeCommand();
        }

        public delegate void UpdateResultDelegate(float tradeCount, float tradePrice, float tradeProfit);

        private void UpdateResult(float tradeCount, float tradePrice, float tradeProfit)
        {
            this._lblTradeCount.Text = $"Count: {tradeCount}";
            this._lblTradePrice.Text = $"Price: {tradePrice}";
            this._lblTradeProfit.Text = $"Profit: {tradeProfit}";
            this._lblTradeProfit.ForeColor = tradeProfit > 0 ? Color.Green : Color.Red;
        }

        private void NinjaTraderActionExecute_OnResultUpdate(float arg1, float arg2, float arg3)
        {
            this.BeginInvoke(new UpdateResultDelegate(UpdateResult), new object[] {arg1, arg2, arg3});
        }

        private void _btnSave_Click(object sender, EventArgs e)
        {
            AppSettings.Instance.AppPath = this._txtAppPath.Text;
            AppSettings.Instance.Username = this._txtUsername.Text;
            AppSettings.Instance.Password = this._txtPassword.Text;
            AppSettings.Instance.ConnectionName = this._txtConnectionName.Text;
            AppSettings.Instance.InstrumentAutoId = this._txtInstrumentName.Text;
            AppSettings.Instance.InstrumentAlert = this._txtInstrumentAlert.Text;
            AppSettings.Instance.BuyAlertStart = this._txtBuyAlertStart.Text;
            AppSettings.Instance.SellAlertStart = this._txtSellAlertStart.Text;
            AppSettings.Instance.BuyLongAccountName = this._txtBuyLong.Text;
            AppSettings.Instance.SellShortAccountName = this._txtSellShort.Text;
            AppSettings.Instance.StrategyBuyLongName = this._txtStrategyBuyLong.Text;
            AppSettings.Instance.StragegySellShortName = this._txtStrategySellShort.Text;
            AppSettings.Instance.LocalIpAddress = this._txtLocalIpAddress.Text;
            AppSettings.Instance.Save();
        }

        private void OpenTradeCommand()
        {
            splitContainer1.Panel1Collapsed = true;
            splitContainer1.Panel2Collapsed = false;
            this.Height = 200;
        }

        private void _btnSetup_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
            var ninjaTraderProcess = NinjaTraderActionExecute.LaunchNinjaTrader(AppSettings.Instance.AppPath);
            NinjaTraderActionExecute.Setup(ninjaTraderProcess);
        }

        private void _locServer_OnReceiveRequest(TradeCommand tradeCmd)
        {
            Task.Run(() => { NinjaTraderActionExecute.ProcessCommand(tradeCmd); });
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            AppSettings.Instance.Save();
        }

        private void _btnStartBuying_Click(object sender, EventArgs e)
        {
            this._startSelling.Enabled = false;
            this._btnStartBuying.Enabled = false;
            if(float.TryParse(this._txtPriceBuy.Text, out float price))
            {
                Task.Run(() => { NinjaTraderActionExecute.ProcessCommand(TradeCommand.Create(AppSettings.Instance.InstrumentAutoId, TradeOptions.BuysGoLong, price)); });
            }
            else
            {
                MessageBox.Show("Pls enter a valid price");
            }
        }

        private void _startSelling_Click(object sender, EventArgs e)
        {
            this._startSelling.Enabled = false;
            this._btnStartBuying.Enabled = false;
            if (float.TryParse(this._txtPriceSell.Text, out float price))
            {
                Task.Run(() => { NinjaTraderActionExecute.ProcessCommand(TradeCommand.Create(AppSettings.Instance.InstrumentAutoId, TradeOptions.SellShort, price)); });
            }
            else
            {
                MessageBox.Show("Pls enter a valid price");
            }
        }

        private void _btnClose_Click(object sender, EventArgs e)
        {
            this._startSelling.Enabled = true;
            this._btnStartBuying.Enabled = true;
            Task.Run(() => { NinjaTraderActionExecute.ProcessCommand(TradeCommand.Create(AppSettings.Instance.InstrumentAutoId, TradeOptions.Close, 0)); });
        }

        private bool _isGetAlert = false;

        private void _btnGetAlert_Click(object sender, EventArgs e)
        {
            this._isGetAlert = !this._isGetAlert;
            if(this._isGetAlert)
            {
                this._btnGetAlert.Text = "Turn off alert";
                _locServer.Start();
            }
            else
            {
                this._btnGetAlert.Text = "Turn on alert";
                _locServer.Stop();
            }
        }

        private void Options_Click(object sender, EventArgs e)
        {
            splitContainer1.Panel1Collapsed = false;
            splitContainer1.Panel2Collapsed = true;
            this.Height = 300;
        }
    }
}
