using System;

namespace NinjaTraderAutomation
{
    public enum TradeOptions
    {
        None,
        BuysGoLong,
        SellShort,
        Close
    }
    public class TradeCommand
    {
        private static DateTime sLastCommandTime = new DateTime();
        private static object sync = new object();
        private TradeCommand() 
        {
        }
        public static TradeCommand Create(string notificationData)
        {
            lock (sync)
            {
                if ((DateTime.Now - sLastCommandTime).TotalSeconds < 60)
                {
                    return null;
                }
                var tradeOption = TradeOptions.None;
                if (notificationData.StartsWith(AppSettings.Instance.BuyAlertStart, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    tradeOption = TradeOptions.BuysGoLong;
                }
                else if (notificationData.StartsWith(AppSettings.Instance.SellAlertStart, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    tradeOption = TradeOptions.SellShort;
                }
                if (tradeOption == TradeOptions.None || notificationData.IndexOf(AppSettings.Instance.InstrumentAlert) < 0)
                {
                    return null;
                }

                sLastCommandTime = DateTime.Now;
                return new TradeCommand { Instrument = AppSettings.Instance.InstrumentAutoId, TradeOption = tradeOption };
            }
        }

        public static TradeCommand Create(string instrustmentAutoId, TradeOptions option)
        {
            return new TradeCommand { Instrument = instrustmentAutoId, TradeOption = option };
        }

        public string Instrument { get; set; }
        public TradeOptions TradeOption { get; set; }
        public override string ToString()
        {
            return $"{this.TradeOption}:{this.Instrument}";
        }
    }
}
