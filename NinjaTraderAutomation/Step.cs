using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaTraderAutomation
{
    public class Step
    {
        public ControlIdentifier Identifier { get; set; }
        public Action Action { get; set; }
        public ActionResultIdentifier ResultIdentifier { get; set; }
    }
}
