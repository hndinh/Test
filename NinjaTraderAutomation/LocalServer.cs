using System;
using System.Drawing;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NinjaTraderAutomation
{
    public class LocalServer
    {
        private HttpListener _httpListener;
        private bool _monitoring;
        public event Action<TradeCommand> OnReceiveRequest;
        public LocalServer()
        {
        }

        string GetIPV4()
        {
            NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface item in interfaces)
            {
                if (item.NetworkInterfaceType == NetworkInterfaceType.Wireless80211)
                {
                    if (item.OperationalStatus == OperationalStatus.Up)
                    {
                        IPInterfaceProperties properties = item.GetIPProperties();
                        foreach (UnicastIPAddressInformation ip in properties.UnicastAddresses)
                        {
                            if (ip.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                            {
                                string ipv4Address = ip.Address.ToString();
                                Console.WriteLine($"IPv4 Address: {ipv4Address}");
                                // You can also return the address here, or store it for later use
                                return ipv4Address;
                            }
                        }
                    }
                }
            }
            return string.Empty;
        }

        public void Start()
        {
            _monitoring = true;
            _httpListener = new HttpListener();
            _httpListener.Prefixes.Clear();
            if(string.IsNullOrEmpty(AppSettings.Instance.LocalIpAddress))
            {
                _httpListener.Prefixes.Add($"http://{AppSettings.Instance.LocalIpAddress}:80/");
            }
            else
            {
                _httpListener.Prefixes.Add($"http://{GetIPV4()}:80/");
            }
            
            _httpListener.Start();
            Task.Run(() => ResponseThread());
        }

        public void Stop()
        {
            _monitoring = false;
            _httpListener.Stop();
            _httpListener.Close();
        }

        public void ResponseThread()
        {
            while(_monitoring)
            {
                try
                {
                    HttpListenerContext context = _httpListener.GetContext();
                    if (string.Compare(context.Request.HttpMethod, "POST", true) == 0 && context.Request.RawUrl == "/" && OnReceiveRequest != null)
                    {
                        var requestData = GetFormData(context.Request);
                        if (requestData != null)
                        {
                            var tradeCmd = TradeCommand.Create(requestData);
                            if (tradeCmd != null)
                            {
                                AppLog.Info($"Execute command {tradeCmd}");
                                OnReceiveRequest(tradeCmd);
                            }
                            else
                            {
                                AppLog.Debug($"{context.Request.UrlReferrer?.AbsoluteUri}:{requestData}");
                            }
                        }
                    }
                    ProcessResponse(context.Response);
                }
                catch { }
            }
        }

        private void ProcessResponse(HttpListenerResponse response)
        {
            var buffer = Encoding.UTF8.GetBytes("OK");
            response.ContentLength64 = buffer.Length;
            response.OutputStream.Write(buffer, 0, buffer.Length);
            response.OutputStream.Close();
        }

        private string GetFormData(HttpListenerRequest request)
        {
            if (!request.HasEntityBody)
            {
                return null;
            }
            using (var body = request.InputStream)
            {
                using (var reader = new System.IO.StreamReader(body, request.ContentEncoding))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }
}
