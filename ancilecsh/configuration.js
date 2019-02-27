// <copyright file="configuration.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Configuration class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.Configuration = ANCILECSH.Configuration || new (function(private, public) { 
	
	public = this;
	
	public.init = function(continueInit) {
		// Load basic configuration.json
		ANCILECSH.loadJSON("configuration/configuration.json", function(json) {
			ANCILECSH.Configuration.HelpButton = json.HelpButton;
			ANCILECSH.Configuration.HelpPanel = json.HelpPanel;
			ANCILECSH.Configuration.HelpServer = json.HelpServer;
			ANCILECSH.Configuration.ShiftApp = json.ShiftApp;
			ANCILECSH.Configuration.Context = json.Context;
			ANCILECSH.Configuration.Monitoring = json.Monitoring;
			if(continueInit){
				continueInit();
			}
		});
		// Load applicationdefinitions.json
		ANCILECSH.loadJSON("configuration/applications.json", function(json1) {
			ANCILECSH.Configuration.ApplicationDefinitions = [];
			var apps = json1.ApplicationDefinitions;
			// For each applications
			$(apps).each(function(i, app){
				// Load application definition
				ANCILECSH.loadJSON("configuration/applications/" + app, function(json2) {
					ANCILECSH.Configuration.ApplicationDefinitions.push(json2.ApplicationDefinition);
				});
			});
		});
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.Configuration);
	};
	
})({});
