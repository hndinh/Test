using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NinjaTraderAutomation
{
    public class ControlIdentifier
    {
        public string Name { get; set; }
        public string WindowTitle { get; set; }
        public string WindowClass { get; set; }
        public string AutomationId { get; set; }
        public int ControlType { get; set; }
    }
}
