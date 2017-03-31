// <copyright file="globalization.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Configuration class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.Globalization = ANCILECSH.Globalization || new (function(private, public) { 
	
	public = this;
	
	public.getCurrentLocale = function() {
		return sap.ui.getCore().getConfiguration().getLanguage();
	};
	
	public.getText = function(id, locale) {
		locale = locale || ANCILECSH.Globalization.getCurrentLocale();
		var i18n = $.sap.resources({url : ANCILECSH.CurrentLocation + "i18n/i18n.properties", locale: locale });
		return i18n.getText(id);
	};
	
	public.init = function() {
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.Globalization);
	};

})({});