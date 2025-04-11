namespace NinjaTraderAutomation
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this._txtAppPath = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this._txtUsername = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this._txtPassword = new System.Windows.Forms.TextBox();
            this._btnSave = new System.Windows.Forms.Button();
            this._btnLogin = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this._txtInstrumentName = new System.Windows.Forms.TextBox();
            this._btnStartBuying = new System.Windows.Forms.Button();
            this._txtInstrumentAlert = new System.Windows.Forms.TextBox();
            this._txtBuyAlertStart = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this._txtSellAlertStart = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this._txtConnectionName = new System.Windows.Forms.TextBox();
            this.label8 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this._txtBuyLong = new System.Windows.Forms.TextBox();
            this._txtSellShort = new System.Windows.Forms.TextBox();
            this.label10 = new System.Windows.Forms.Label();
            this._txtStrategyBuyLong = new System.Windows.Forms.TextBox();
            this.label11 = new System.Windows.Forms.Label();
            this._txtStrategySellShort = new System.Windows.Forms.TextBox();
            this._startSelling = new System.Windows.Forms.Button();
            this._btnClose = new System.Windows.Forms.Button();
            this._lblTradeCount = new System.Windows.Forms.Label();
            this._lblTradePrice = new System.Windows.Forms.Label();
            this._lblTradeProfit = new System.Windows.Forms.Label();
            this.label12 = new System.Windows.Forms.Label();
            this._txtLocalIpAddress = new System.Windows.Forms.TextBox();
            this._btnGetAlert = new System.Windows.Forms.Button();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.button1 = new System.Windows.Forms.Button();
            this._txtPriceBuy = new System.Windows.Forms.TextBox();
            this._txtPriceSell = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
            this.splitContainer1.Panel1.SuspendLayout();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            this.SuspendLayout();
            // 
            // _txtAppPath
            // 
            this._txtAppPath.Location = new System.Drawing.Point(96, 5);
            this._txtAppPath.Name = "_txtAppPath";
            this._txtAppPath.Size = new System.Drawing.Size(378, 20);
            this._txtAppPath.TabIndex = 0;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 6);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(51, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "App Path";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(8, 33);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(55, 13);
            this.label2.TabIndex = 1;
            this.label2.Text = "Username";
            // 
            // _txtUsername
            // 
            this._txtUsername.Location = new System.Drawing.Point(96, 32);
            this._txtUsername.Name = "_txtUsername";
            this._txtUsername.Size = new System.Drawing.Size(140, 20);
            this._txtUsername.TabIndex = 0;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(238, 36);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(53, 13);
            this.label3.TabIndex = 1;
            this.label3.Text = "Password";
            // 
            // _txtPassword
            // 
            this._txtPassword.Location = new System.Drawing.Point(294, 34);
            this._txtPassword.Name = "_txtPassword";
            this._txtPassword.PasswordChar = '*';
            this._txtPassword.Size = new System.Drawing.Size(180, 20);
            this._txtPassword.TabIndex = 0;
            this._txtPassword.UseSystemPasswordChar = true;
            // 
            // _btnSave
            // 
            this._btnSave.Location = new System.Drawing.Point(504, 207);
            this._btnSave.Name = "_btnSave";
            this._btnSave.Size = new System.Drawing.Size(82, 23);
            this._btnSave.TabIndex = 2;
            this._btnSave.Text = "Save settings";
            this._btnSave.UseVisualStyleBackColor = true;
            this._btnSave.Click += new System.EventHandler(this._btnSave_Click);
            // 
            // _btnLogin
            // 
            this._btnLogin.Location = new System.Drawing.Point(11, 7);
            this._btnLogin.Name = "_btnLogin";
            this._btnLogin.Size = new System.Drawing.Size(108, 23);
            this._btnLogin.TabIndex = 3;
            this._btnLogin.Text = "Setup Ninja Trader";
            this._btnLogin.UseVisualStyleBackColor = true;
            this._btnLogin.Click += new System.EventHandler(this._btnSetup_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(8, 89);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(100, 13);
            this.label4.TabIndex = 1;
            this.label4.Text = "Instrument Mapping";
            // 
            // _txtInstrumentName
            // 
            this._txtInstrumentName.Location = new System.Drawing.Point(316, 88);
            this._txtInstrumentName.Name = "_txtInstrumentName";
            this._txtInstrumentName.Size = new System.Drawing.Size(158, 20);
            this._txtInstrumentName.TabIndex = 0;
            // 
            // _btnStartBuying
            // 
            this._btnStartBuying.Location = new System.Drawing.Point(12, 36);
            this._btnStartBuying.Name = "_btnStartBuying";
            this._btnStartBuying.Size = new System.Drawing.Size(76, 23);
            this._btnStartBuying.TabIndex = 3;
            this._btnStartBuying.Text = "Start Buying";
            this._btnStartBuying.UseVisualStyleBackColor = true;
            this._btnStartBuying.Click += new System.EventHandler(this._btnStartBuying_Click);
            // 
            // _txtInstrumentAlert
            // 
            this._txtInstrumentAlert.Location = new System.Drawing.Point(114, 88);
            this._txtInstrumentAlert.Name = "_txtInstrumentAlert";
            this._txtInstrumentAlert.Size = new System.Drawing.Size(158, 20);
            this._txtInstrumentAlert.TabIndex = 0;
            // 
            // _txtBuyAlertStart
            // 
            this._txtBuyAlertStart.Location = new System.Drawing.Point(96, 186);
            this._txtBuyAlertStart.Name = "_txtBuyAlertStart";
            this._txtBuyAlertStart.Size = new System.Drawing.Size(378, 20);
            this._txtBuyAlertStart.TabIndex = 0;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(8, 186);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(71, 13);
            this.label5.TabIndex = 1;
            this.label5.Text = "Buy alert start";
            // 
            // _txtSellAlertStart
            // 
            this._txtSellAlertStart.Location = new System.Drawing.Point(96, 212);
            this._txtSellAlertStart.Name = "_txtSellAlertStart";
            this._txtSellAlertStart.Size = new System.Drawing.Size(378, 20);
            this._txtSellAlertStart.TabIndex = 0;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(8, 212);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(70, 13);
            this.label6.TabIndex = 1;
            this.label6.Text = "Sell alert start";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(8, 116);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(63, 13);
            this.label7.TabIndex = 1;
            this.label7.Text = "Conn Name";
            // 
            // _txtConnectionName
            // 
            this._txtConnectionName.Location = new System.Drawing.Point(96, 114);
            this._txtConnectionName.Name = "_txtConnectionName";
            this._txtConnectionName.Size = new System.Drawing.Size(378, 20);
            this._txtConnectionName.TabIndex = 0;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(8, 138);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(77, 13);
            this.label8.TabIndex = 1;
            this.label8.Text = "Buy Long Acct";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(8, 160);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(74, 13);
            this.label9.TabIndex = 1;
            this.label9.Text = "Sell Short Acc";
            // 
            // _txtBuyLong
            // 
            this._txtBuyLong.Location = new System.Drawing.Point(96, 135);
            this._txtBuyLong.Name = "_txtBuyLong";
            this._txtBuyLong.Size = new System.Drawing.Size(140, 20);
            this._txtBuyLong.TabIndex = 0;
            // 
            // _txtSellShort
            // 
            this._txtSellShort.Location = new System.Drawing.Point(96, 157);
            this._txtSellShort.Name = "_txtSellShort";
            this._txtSellShort.Size = new System.Drawing.Size(140, 20);
            this._txtSellShort.TabIndex = 0;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(242, 138);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(46, 13);
            this.label10.TabIndex = 1;
            this.label10.Text = "Strategy";
            // 
            // _txtStrategyBuyLong
            // 
            this._txtStrategyBuyLong.Location = new System.Drawing.Point(294, 135);
            this._txtStrategyBuyLong.Name = "_txtStrategyBuyLong";
            this._txtStrategyBuyLong.Size = new System.Drawing.Size(180, 20);
            this._txtStrategyBuyLong.TabIndex = 0;
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(242, 160);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(46, 13);
            this.label11.TabIndex = 1;
            this.label11.Text = "Strategy";
            // 
            // _txtStrategySellShort
            // 
            this._txtStrategySellShort.Location = new System.Drawing.Point(294, 160);
            this._txtStrategySellShort.Name = "_txtStrategySellShort";
            this._txtStrategySellShort.Size = new System.Drawing.Size(180, 20);
            this._txtStrategySellShort.TabIndex = 0;
            // 
            // _startSelling
            // 
            this._startSelling.Location = new System.Drawing.Point(12, 61);
            this._startSelling.Name = "_startSelling";
            this._startSelling.Size = new System.Drawing.Size(76, 23);
            this._startSelling.TabIndex = 3;
            this._startSelling.Text = "Start Selling";
            this._startSelling.UseVisualStyleBackColor = true;
            this._startSelling.Click += new System.EventHandler(this._startSelling_Click);
            // 
            // _btnClose
            // 
            this._btnClose.Location = new System.Drawing.Point(11, 90);
            this._btnClose.Name = "_btnClose";
            this._btnClose.Size = new System.Drawing.Size(76, 23);
            this._btnClose.TabIndex = 3;
            this._btnClose.Text = "Close";
            this._btnClose.UseVisualStyleBackColor = true;
            this._btnClose.Click += new System.EventHandler(this._btnClose_Click);
            // 
            // _lblTradeCount
            // 
            this._lblTradeCount.AutoSize = true;
            this._lblTradeCount.ForeColor = System.Drawing.Color.Black;
            this._lblTradeCount.Location = new System.Drawing.Point(471, 11);
            this._lblTradeCount.Name = "_lblTradeCount";
            this._lblTradeCount.Size = new System.Drawing.Size(40, 13);
            this._lblTradeCount.TabIndex = 1;
            this._lblTradeCount.Text = "Result:";
            // 
            // _lblTradePrice
            // 
            this._lblTradePrice.AutoSize = true;
            this._lblTradePrice.ForeColor = System.Drawing.Color.Black;
            this._lblTradePrice.Location = new System.Drawing.Point(472, 37);
            this._lblTradePrice.Name = "_lblTradePrice";
            this._lblTradePrice.Size = new System.Drawing.Size(40, 13);
            this._lblTradePrice.TabIndex = 1;
            this._lblTradePrice.Text = "Result:";
            // 
            // _lblTradeProfit
            // 
            this._lblTradeProfit.AutoSize = true;
            this._lblTradeProfit.ForeColor = System.Drawing.Color.Black;
            this._lblTradeProfit.Location = new System.Drawing.Point(471, 66);
            this._lblTradeProfit.Name = "_lblTradeProfit";
            this._lblTradeProfit.Size = new System.Drawing.Size(40, 13);
            this._lblTradeProfit.TabIndex = 1;
            this._lblTradeProfit.Text = "Result:";
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(8, 66);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(87, 13);
            this.label12.TabIndex = 1;
            this.label12.Text = "Local IP Address";
            // 
            // _txtLocalIpAddress
            // 
            this._txtLocalIpAddress.Location = new System.Drawing.Point(101, 62);
            this._txtLocalIpAddress.Name = "_txtLocalIpAddress";
            this._txtLocalIpAddress.Size = new System.Drawing.Size(261, 20);
            this._txtLocalIpAddress.TabIndex = 0;
            // 
            // _btnGetAlert
            // 
            this._btnGetAlert.Location = new System.Drawing.Point(368, 59);
            this._btnGetAlert.Name = "_btnGetAlert";
            this._btnGetAlert.Size = new System.Drawing.Size(106, 23);
            this._btnGetAlert.TabIndex = 4;
            this._btnGetAlert.Text = "Turn on alert";
            this._btnGetAlert.UseVisualStyleBackColor = true;
            this._btnGetAlert.Click += new System.EventHandler(this._btnGetAlert_Click);
            // 
            // splitContainer1
            // 
            this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer1.Location = new System.Drawing.Point(0, 0);
            this.splitContainer1.Name = "splitContainer1";
            this.splitContainer1.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // splitContainer1.Panel1
            // 
            this.splitContainer1.Panel1.Controls.Add(this._txtInstrumentAlert);
            this.splitContainer1.Panel1.Controls.Add(this._btnGetAlert);
            this.splitContainer1.Panel1.Controls.Add(this._txtAppPath);
            this.splitContainer1.Panel1.Controls.Add(this._txtUsername);
            this.splitContainer1.Panel1.Controls.Add(this._txtLocalIpAddress);
            this.splitContainer1.Panel1.Controls.Add(this._txtConnectionName);
            this.splitContainer1.Panel1.Controls.Add(this._btnSave);
            this.splitContainer1.Panel1.Controls.Add(this._txtBuyLong);
            this.splitContainer1.Panel1.Controls.Add(this._txtSellShort);
            this.splitContainer1.Panel1.Controls.Add(this.label4);
            this.splitContainer1.Panel1.Controls.Add(this._txtStrategyBuyLong);
            this.splitContainer1.Panel1.Controls.Add(this.label3);
            this.splitContainer1.Panel1.Controls.Add(this._txtStrategySellShort);
            this.splitContainer1.Panel1.Controls.Add(this._txtBuyAlertStart);
            this.splitContainer1.Panel1.Controls.Add(this._txtSellAlertStart);
            this.splitContainer1.Panel1.Controls.Add(this._txtPassword);
            this.splitContainer1.Panel1.Controls.Add(this.label6);
            this.splitContainer1.Panel1.Controls.Add(this._txtInstrumentName);
            this.splitContainer1.Panel1.Controls.Add(this.label5);
            this.splitContainer1.Panel1.Controls.Add(this.label1);
            this.splitContainer1.Panel1.Controls.Add(this.label11);
            this.splitContainer1.Panel1.Controls.Add(this.label2);
            this.splitContainer1.Panel1.Controls.Add(this.label10);
            this.splitContainer1.Panel1.Controls.Add(this.label12);
            this.splitContainer1.Panel1.Controls.Add(this.label9);
            this.splitContainer1.Panel1.Controls.Add(this.label7);
            this.splitContainer1.Panel1.Controls.Add(this.label8);
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this._txtPriceSell);
            this.splitContainer1.Panel2.Controls.Add(this._txtPriceBuy);
            this.splitContainer1.Panel2.Controls.Add(this.button1);
            this.splitContainer1.Panel2.Controls.Add(this._lblTradePrice);
            this.splitContainer1.Panel2.Controls.Add(this._btnClose);
            this.splitContainer1.Panel2.Controls.Add(this._lblTradeCount);
            this.splitContainer1.Panel2.Controls.Add(this._startSelling);
            this.splitContainer1.Panel2.Controls.Add(this._lblTradeProfit);
            this.splitContainer1.Panel2.Controls.Add(this._btnStartBuying);
            this.splitContainer1.Panel2.Controls.Add(this._btnLogin);
            this.splitContainer1.Size = new System.Drawing.Size(610, 381);
            this.splitContainer1.SplitterDistance = 247;
            this.splitContainer1.TabIndex = 5;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(125, 7);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 4;
            this.button1.Text = "Options";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.Options_Click);
            // 
            // _txtPriceBuy
            // 
            this._txtPriceBuy.Location = new System.Drawing.Point(96, 38);
            this._txtPriceBuy.Name = "_txtPriceBuy";
            this._txtPriceBuy.Size = new System.Drawing.Size(176, 20);
            this._txtPriceBuy.TabIndex = 5;
            // 
            // _txtPriceSell
            // 
            this._txtPriceSell.Location = new System.Drawing.Point(94, 63);
            this._txtPriceSell.Name = "_txtPriceSell";
            this._txtPriceSell.Size = new System.Drawing.Size(176, 20);
            this._txtPriceSell.TabIndex = 5;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(610, 381);
            this.Controls.Add(this.splitContainer1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Form1_FormClosed);
            this.Load += new System.EventHandler(this.Form1_Load);
            this.splitContainer1.Panel1.ResumeLayout(false);
            this.splitContainer1.Panel1.PerformLayout();
            this.splitContainer1.Panel2.ResumeLayout(false);
            this.splitContainer1.Panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
            this.splitContainer1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TextBox _txtAppPath;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox _txtUsername;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox _txtPassword;
        private System.Windows.Forms.Button _btnSave;
        private System.Windows.Forms.Button _btnLogin;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox _txtInstrumentName;
        private System.Windows.Forms.Button _btnStartBuying;
        private System.Windows.Forms.TextBox _txtInstrumentAlert;
        private System.Windows.Forms.TextBox _txtBuyAlertStart;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox _txtSellAlertStart;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox _txtConnectionName;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.TextBox _txtBuyLong;
        private System.Windows.Forms.TextBox _txtSellShort;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.TextBox _txtStrategyBuyLong;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.TextBox _txtStrategySellShort;
        private System.Windows.Forms.Button _startSelling;
        private System.Windows.Forms.Button _btnClose;
        private System.Windows.Forms.Label _lblTradeCount;
        private System.Windows.Forms.Label _lblTradePrice;
        private System.Windows.Forms.Label _lblTradeProfit;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.TextBox _txtLocalIpAddress;
        private System.Windows.Forms.Button _btnGetAlert;
        private System.Windows.Forms.SplitContainer splitContainer1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.TextBox _txtPriceSell;
        private System.Windows.Forms.TextBox _txtPriceBuy;
    }
}

