// <copyright file="applicationrecognizer.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Monitoring class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.ApplicationRecognizer = ANCILECSH.ApplicationRecognizer || new (function(private, public) { 
	
	public = this;
	
	public.recognizeApplication = function() {
		if (ANCILECSH.ApplicationRecognizer.LastRecognizedApplication === undefined || ANCILECSH.ApplicationRecognizer.LastRecognizedApplication === null) {
			var app = null;
			$(ANCILECSH.Configuration.ApplicationDefinitions).each(function(i, application) {
				var isMatchedAllProperties = true;
				$(application.Properties).each(function(j, property) {
					// jQuerySelector property
					if (property.jQuerySelector !== null && property.jQuerySelector !== undefined) {
						var isMatched = $(property.jQuerySelector).length > 0;
						if (!isMatched) {
							isMatchedAllProperties = false;
							return false; //Break loop application's properties
						}
					}
				});
				if (isMatchedAllProperties) {
					// Get loaded libraries
					app = application;
					app.LoadedLibraries = sap.ui.getCore().getLoadedLibraries();
					app.IsSapM = (app.LoadedLibraries["sap.m"] !== undefined) && ($("*[class*='sapM']").length > 0);
					app.IsSapUiCommons = (app.LoadedLibraries["sap.ui.commons"] !== undefined) && (!app.IsSapM);
					if (app.IsSapM === true || app.IsSapUiCommons === true) {
						ANCILECSH.ApplicationRecognizer.LastRecognizedApplication = app;
					}
					else {
						ANCILECSH.Console.debug("SAP UI5 library has not yet been loaded!");
						ANCILECSH.ApplicationRecognizer.LastRecognizedApplication = null;
					}

					return false; //Break loop application definitions
				} else {
					ANCILECSH.ApplicationRecognizer.LastRecognizedApplication = application;
				}
			});
			if(ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.IsSapM === undefined || ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.IsSapM === null) {
				ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.LoadedLibraries = sap.ui.getCore().getLoadedLibraries();
				ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.IsSapM = (app.LoadedLibraries["sap.m"] !== undefined) && ($("*[class*='sapM']").length > 0);
				ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.IsSapUiCommons = (app.LoadedLibraries["sap.ui.commons"] !== undefined) && (!app.IsSapM);
				if (ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.IsSapM === true || ANCILECSH.ApplicationRecognizer.LastRecognizedApplication.IsSapUiCommons === true) {
					ANCILECSH.Console.debug("No application detected!");
				}
				else {
					ANCILECSH.Console.debug("SAP UI5 library has not yet been loaded!");
					ANCILECSH.ApplicationRecognizer.LastRecognizedApplication = null;
				}
			}
			return ANCILECSH.ApplicationRecognizer.LastRecognizedApplication;
		}
		return ANCILECSH.ApplicationRecognizer.LastRecognizedApplication;
	};
	
	public.init = function() {
		// Recognize current application
		ANCILECSH.ApplicationRecognizer.recognizeApplication();
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.ApplicationRecognizer);
	};
	
})({});
