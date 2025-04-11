using System;
using System.Collections.Generic;
using System.Linq;

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
                List<string> listData = notificationData.Split(new char[1] {','}).ToList();
                float price = 0;
                foreach(var data in listData)
                {
                    List<string> segments = data.Split(new char[1] { '=' }).ToList();
                    if (segments[0].Trim().ToLower() == "price" && segments.Count == 2)
                    {
                        price = float.Parse(segments[1].Trim());
                    }
                }
                return new TradeCommand { Instrument = AppSettings.Instance.InstrumentAutoId, TradeOption = tradeOption, Price = price };
            }
        }

        public static TradeCommand Create(string instrustmentAutoId, TradeOptions option, float price)
        {
            return new TradeCommand { Instrument = instrustmentAutoId, TradeOption = option, Price = price };
        }

        public string Instrument { get; set; }
        public TradeOptions TradeOption { get; set; }
        public float Price { get; set; }
        public override string ToString()
        {
            return $"{this.TradeOption}:{this.Instrument}";
        }
    }
}
