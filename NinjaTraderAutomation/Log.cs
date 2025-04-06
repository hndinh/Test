using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NinjaTraderAutomation
{
    public enum LogLevel
    {
        FatalOnly = 0,
        Low = 1,
        Medium = 2,
        High = 3,
        Debug = 4,
        Normal = 5
    }

    public class Log : IDisposable
    {
        private static string _critical;
        private static string _debug;
        private static string _fatal;
        private static string _info;
        private static string _warning;

        private string _name;
        private string _directory;
        private LogLevel _level;
        private StreamWriter _ostream;
        private object _sync;
        private List<bool> _components;


        #region Object Creation

        public Log(string directory,
                        string name,
                        LogLevel level)
            : this(directory, name, level, null)
        {

        }


        public Log(string directory,
                        string name,
                        LogLevel level,
                        IEnumerable<bool> components)
        {
            StringBuilder logName;

            _sync = new object();
            _level = level;

            if (components != null)
                _components = new List<bool>(components);   // List of on/off components

            logName = new StringBuilder(32);
            logName.Append(name);
            logName.Append('_');
            logName.Append(DateTime.Now.ToString("yyyyMMdd.HHmmssf"));
            logName.Append(".log");
            _name = logName.ToString();

            _ostream = new StreamWriter(new FileStream(_name, FileMode.Create, FileAccess.Write, FileShare.Read));

            _critical = "Critical";
            _debug = "Debug";
            _fatal = "Fatal";
            _info = "Info";
            _warning = "Warning";
        }

        ~Log()
        {
            Dispose();
        }

        #endregion


        #region Properties

        public string Name
        {
            get { return _name; }
        }

        public LogLevel LogLevel
        {
            get { return _level; }
            set { _level = value; }
        }

        public string Directory
        {
            get { return _directory; }
        }

        public string FullPath
        {
            get { return _directory + _name; }
        }

        #endregion


        #region Public Functions

        public void Error(string message)
        {
            if (_level >= LogLevel.Low)
            {
                this.LogMessage(message, _critical, null);
            }
        }

        public void Error(Exception exc)
        {
            if (_level >= LogLevel.Low)
            {
                this.LogException(exc, _critical, null);
            }
        }

        public void Error(string message, int id, string component)
        {
            if (_level >= LogLevel.Low)
            {
                this.LogMessage(message, _critical, component);
            }
        }

        public void Error(Exception exc, int id, string component)
        {
            if (_level >= LogLevel.Low)
            {
                this.LogException(exc, _critical, component);
            }
        }

        public void Warning(string message)
        {
            if (_level >= LogLevel.Medium)
            {
                this.LogMessage(message, _warning, null);
            }
        }

        public void Warning(Exception exc)
        {
            if (_level >= LogLevel.Medium)
            {
                this.LogException(exc, _warning, null);
            }
        }

        public void Warning(string message, int id, string component)
        {
            if (_level >= LogLevel.Medium)
            {
                this.LogMessage(message, _warning, component);
            }
        }

        public void Warning(Exception exc, int id, string component)
        {
            if (_level >= LogLevel.Medium)
            {
                this.LogException(exc, _warning, component);
            }
        }

        public void Info(string message)
        {
            if (_level >= LogLevel.High)
            {
                this.LogMessage(message, _info, null);
            }
        }

        public void Info(Exception exc)
        {
            if (_level >= LogLevel.High)
            {
                this.LogException(exc, _info, null);
            }
        }

        public void Info(string message, int id, string component)
        {
            if (_level >= LogLevel.High && _components[id])
            {
                this.LogMessage(message, _info, component);
            }
        }

        public void Info(Exception exc, int id, string component)
        {
            if (_level >= LogLevel.High && _components[id])
            {
                this.LogException(exc, _info, component);
            }
        }

        public void Debug(string message)
        {
            if (_level >= LogLevel.Debug)
            {
                this.LogMessage(message, _debug, null);
            }
        }

        public void Debug(Exception exc)
        {
            if (_level >= LogLevel.Debug)
            {
                this.LogException(exc, _debug, null);
            }
        }

        public void Debug(string message, int id, string component)
        {
            if (_level >= LogLevel.Debug && _components[id])
            {
                this.LogMessage(message, _debug, component);
            }
        }

        public void Debug(Exception exc, int id, string component)
        {
            if (_level >= LogLevel.Debug && _components[id])
            {
                this.LogException(exc, _debug, component);
            }
        }

        public void Fatal(string message)
        {
            if (_level >= LogLevel.FatalOnly)
            {
                this.LogMessage(message, _fatal, null);
            }
        }

        public void Fatal(Exception exc)
        {
            if (_level >= LogLevel.FatalOnly)
            {
                this.LogException(exc, _fatal, null);
            }
        }

        public void Fatal(string message, int id, string component)
        {
            if (_level >= LogLevel.FatalOnly && _components[id])
            {
                this.LogMessage(message, _fatal, component);
            }
        }

        public void Fatal(Exception exc, int id, string component)
        {
            if (_level >= LogLevel.FatalOnly && _components[id])
            {
                this.LogException(exc, _fatal, component);
            }
        }

        public void LogNewline()
        {
            lock (_sync)
            {
                try
                {
                    _ostream.WriteLine();
                }
                catch (IOException)
                { }
            }
        }

        public void LogInfoNoPrefix(string message)
        {
            if (_level >= LogLevel.High)
            {
                try
                {
                    lock (_sync)
                    {
                        _ostream.WriteLine(message);
                        _ostream.Flush();
                    }
                }
                catch (IOException)
                { }
            }
        }

        public void Dispose()
        {
            FileInfo info;

            if (_sync != null)
                Monitor.Enter(_sync);

            if (_ostream != null)
            {
                try
                {
                    try
                    {
                        info = new FileInfo(_directory + _name);
                        if (_ostream.BaseStream.CanRead)
                        {
                            if (info.Length == 0)
                            {
                                _ostream.Close();
                                File.Delete(_name);
                                _ostream = null;
                            }
                            else
                            {
                                _ostream.Flush();
                            }
                        }

                    }
                    finally
                    {
                        if (_ostream != null && _ostream.BaseStream.CanWrite)
                            _ostream.Close();
                    }
                }
                catch (IOException)
                { }
                GC.SuppressFinalize(this);
            }

            if (_sync != null)
                Monitor.Exit(_sync);
        }

        #endregion


        #region Private Functions

        private void LogException(Exception exc, string logType, string component)
        {
            if (exc == null)
                return;

            try
            {
                lock (_sync)
                {
                    if (_ostream == null || _ostream.BaseStream == null || !_ostream.BaseStream.CanWrite)
                        return;

                    _ostream.WriteLine();
                    _ostream.Write(DateTime.Now.ToString("G", DateTimeFormatInfo.InvariantInfo));

                    if (component != null)
                    {
                        _ostream.Write("\t: ");
                        _ostream.WriteLine(component);
                    }

                    _ostream.Write(": ");
                    _ostream.WriteLine(logType + "\t: " + exc.Message);
                    if (exc.InnerException != null)
                        _ostream.WriteLine(exc.InnerException.ToString());
                    _ostream.WriteLine(exc.StackTrace);
                    _ostream.Flush();
                }
            }
            catch (IOException)
            { }
        }

        private void LogMessage(string message, string logType, string component)
        {
            try
            {
                lock (_sync)
                {
                    if (_ostream == null || _ostream.BaseStream == null || !_ostream.BaseStream.CanWrite)
                        return;

                    _ostream.Write(DateTime.Now.ToString("G", DateTimeFormatInfo.InvariantInfo));

                    if (component != null)
                    {
                        _ostream.Write("\t: ");
                        _ostream.Write(component);
                    }

                    _ostream.Write(": ");
                    _ostream.WriteLine(logType + "\t: " + message);
                    _ostream.Flush();
                }
            }
            catch (IOException)
            { }
        }

        #endregion
    }

    public static class AppLog
    {
        private static Log _log;

        static AppLog()
        {
            _log = new Log("",
                            "Application",
                            LogLevel.Debug);
        }

        public static void PreserveStackTrace(Exception exception)
        {
            MethodInfo preserveStackTrace = typeof(Exception).GetMethod("InternalPreserveStackTrace",
              BindingFlags.Instance | BindingFlags.NonPublic);
            preserveStackTrace.Invoke(exception, null);
        }

        public static Log Instance
        {
            get { return _log; }
        }

        public static void Error(string message)
        {
            _log.Error(message);
        }

        public static void Error(Exception exc)
        {
            _log.Error(exc);
        }

        public static void Warning(string message)
        {
            _log.Warning(message);
        }

        public static void Warning(Exception exc)
        {
            _log.Warning(exc);
        }

        public static void Info(string message)
        {
            _log.Info(message);
        }

        public static void Info(Exception exc)
        {
            _log.Info(exc);
        }

        public static void Debug(string message)
        {
            _log.Debug(message);
        }

        public static void Debug(Exception exc)
        {
            _log.Debug(exc);
        }
    }
}
