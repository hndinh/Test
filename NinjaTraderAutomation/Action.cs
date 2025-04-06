using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaTraderAutomation
{
    public enum ActionType
    {
        Click,
        RightClick,
        DoubleClick,
        Type,
        Key
    }

    public class Action
    {
        public ActionType Type { get; set; }
        public string Text { get; set; }
        public int Key { get; set; }
    }
}
