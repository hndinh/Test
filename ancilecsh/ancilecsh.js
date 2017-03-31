// <copyright file="ancilecsh.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH
//
var ANCILECSH = ANCILECSH || new (function(private, public) {
	
	public = this;
	
	private.IsInitialized = false;
	
	private.getCurrentLocation = function() {
		var location = "";
		try {
			var found = false;
			// Check if ancilecsh.js is loaded by $.sap.require()
			var modules = $.sap.getAllDeclaredModules();
			for (var i = modules.length - 1; i >= 0; i--) {
				var module = modules[i];
				if (module.lastIndexOf("ancilecsh") > 0) {
					// Found ancilecsh module
					location = $.sap.getModulePath(module);
					location = location.split("/").slice(0, -1).join("/") + "/";
					found = true;
					break;
				}
			}
			// Check if ancilecsh.js is loaded by insert <script> tag
			if (!found) {
				var scripts = $("script[src*='ancilecsh.js']");
				if (scripts.length > 0) {
					location = scripts[0].src.split("/").slice(0, -1).join("/") + "/";
					found = true;
				}
			}
		}
		catch (err) {
			ANCILECSH.Console.error(err);
		}
		return location;
    };
    
    private.loadConsole = function() {
		// Load built-in console
		ANCILECSH.Console = console || {};
		ANCILECSH.Console.log = ANCILECSH.Console.log || function() {};
		ANCILECSH.Console.debug = ANCILECSH.Console.debug || ANCILECSH.Console.log || function() {};
		ANCILECSH.Console.info = ANCILECSH.Console.info || ANCILECSH.Console.log || function() {};
		ANCILECSH.Console.warn = ANCILECSH.Console.warn || function() {};
		ANCILECSH.Console.error = ANCILECSH.Console.error || function() {};
	};
	
	private.loadStylesheet = function() {
		// Load ancilecsh css
		if ($("link[href*='ancilecsh.css']").length <= 0) {
			ANCILECSH.loadCSS("css/ancilecsh.css");
		}
	};
    
    private.loadDependencies = function(dependencies, fn) {
    	if (dependencies && dependencies.length && dependencies.length > 0) {
			var count = 0;
			$(dependencies).each(function(i, dependency) {
				ANCILECSH.loadScript(dependency, function() {
					count++;
				});
			});
			// Wait all complete
			var t = setInterval(function(){
				if (count === dependencies.length) {
					if (fn) {
						fn();
					}
					clearInterval(t);
				}
			}, 100);
    	}
    };
	
    public.isFileExist = function(url) {
		var exist = false;
		try {
			$.ajax({
				url: url, 
				type: "HEAD", 
				async: false,
				success: function() {
					exist = true;
				}, 
				error: function() {
					exist = false;
				}
			});
		}
		catch(err) {
			exist = false;
		}
		return exist;	
	};
	
	public.loadScript = function(script, success, error) {
		$.ajax({
			url: ANCILECSH.CurrentLocation + script,
			dataType: "script",
			async: false, //Make sure we can use the script in next line
			success: success,
			error: error
		});
	};
	
	public.loadJSON = function(json, success, error) {
		$.ajax({
			url: ANCILECSH.CurrentLocation + json,
			dataType: "json",
			async: false, //Make sure we can use the json in next line
			success: success,
			error: error
		});
	};
	
	public.loadCSS = function(css) {
		$("head").append($("<link type='text/css' rel='stylesheet' href='" + ANCILECSH.CurrentLocation.toString() + css + "'></link>"));
	};
	
	public.isInitialized = function() {
		return private.IsInitialized;	
	};
	
	public.init = function () {
		// Begin
		private.IsInitialized = false;
		// Load console
		private.loadConsole();
		// Cache current location
		ANCILECSH.CurrentLocation = private.getCurrentLocation();
		//
		try {
			// Load dependencies
			private.loadDependencies(["constants.js", "configuration.js", "utilities.js", "globalization.js", "applicationrecognizer.js", "context.js", "helpbutton.js", "helppanel.js", "monitoring.js"], function() {
				// All dependencies have been loaded
				// Init constants
				ANCILECSH.Constants.init();
				// Init configuration
				ANCILECSH.Configuration.init();
				// Init utilities
				ANCILECSH.Utilities.init();
				// Init globalization
				ANCILECSH.Globalization.init();
				// Init application recognizer
				ANCILECSH.ApplicationRecognizer.init();
				// Init context
				ANCILECSH.Context.init();
				// Init help button
				ANCILECSH.HelpButton.init();
				// Init help panel
				ANCILECSH.HelpPanel.init();
				// Init monitoring
				ANCILECSH.Monitoring.init();
				// Load stylesheet
				private.loadStylesheet();
				// Done
				private.IsInitialized = true;
				// Display initialized object in console
				ANCILECSH.Console.debug(ANCILECSH);
			});
		}
		catch (err) {
			ANCILECSH.Console.error(err);
		}
	};
	
})({});

ANCILECSH.init();