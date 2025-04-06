using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace NinjaTraderAutomation
{
    public class AppSettings
    {
        private static AppSettings instance;
        public static AppSettings Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = File.Exists("settings.json") ? JsonConvert.DeserializeObject<AppSettings>(File.ReadAllText("settings.json")) : new AppSettings();
                    if(instance.Password?.Length > 0)
                    {
                        instance.Password = System.Text.UTF8Encoding.UTF8.GetString(System.Convert.FromBase64String(instance.Password));
                    }
                }

                return instance;
            }
        }
        private AppSettings() { }
        public void Save()
        {
            var rawPass = this.Password;
            this.Password = System.Convert.ToBase64String(System.Text.UTF8Encoding.UTF8.GetBytes(this.Password));
            File.WriteAllText(@"settings.json", JsonConvert.SerializeObject(this, Formatting.Indented));
            this.Password = rawPass;
        }

        public string AppPath { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string LocalIpAddress { get; set; }
        public string ConnectionName { get; set; }

        public string BuyLongAccountName { get; set; }

        public string SellShortAccountName { get; set; }

        public string StrategyBuyLongName { get; set; }

        public string StragegySellShortName { get; set; }

        public string InstrumentAlert { get; set; }
        public string InstrumentAutoId { get; set; }
        public string BuyAlertStart { get; set; }
        public string SellAlertStart { get; set; }
        public List<Step> TradeStart { get; set; }
        public List<Step> TradeEnd { get; set; }
    }
}
