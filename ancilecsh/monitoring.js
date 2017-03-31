// <copyright file="monitoring.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Monitoring class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.Monitoring = ANCILECSH.Monitoring || new (function(private, public) { 
	
	public = this;

	private.UiElements = [];
	
	private.LastActedViewId = "";
	
	private.LastActedControlId = "";
	
	private.checkNewUiElements = function($uiElements) {
		var hasNewUiElements = false;
		$uiElements.each(function(i, uiElement) {
			// This ui element is not exist in the cached views list
			if (private.UiElements.indexOf(uiElement) < 0) {
				hasNewUiElements = true;
				//ANCILECSH.Console.debug("Found new ui element " + uiElement.id);
				return false; // break;
			}
		});
		return hasNewUiElements;
	};
	
	private.checkObsoleteUiElements = function($uiElements) {
		var hasObsoleteUiElements = false;
		$(private.UiElements).each(function(i, uiElement){
			// This ui element is nolonger in the cached views list
			if ($uiElements.index(uiElement) < 0) {
				hasObsoleteUiElements = true;
				//ANCILECSH.Console.debug("Found obsolete ui element " + uiElement.id);
				return false; // break;
			}
		});
		return hasObsoleteUiElements;
	};
	
	private.checkUiChanges = function() {
		var hasNewUiElements = false;
		var hasObsoleteUiElements = false;
		var arrUiElements = [];
		$(ANCILECSH.Configuration.Monitoring.UiElements).each(function(i, config){
			arrUiElements = arrUiElements.concat($(config).toArray());
		});
		if (arrUiElements.length > 0) {
			var $arrUiElements = $(arrUiElements);
			hasNewUiElements = private.checkNewUiElements($arrUiElements);
			hasObsoleteUiElements = private.checkObsoleteUiElements($arrUiElements);
		}
		private.UiElements = arrUiElements;
		return hasNewUiElements || hasObsoleteUiElements;
	};
	
	private.onSapUiCoreIntervalTimer = function() {
		//ANCILECSH.Console.debug("onSapUiCoreIntervalTimer isUiReady[" + ANCILECSH.Utilities.isUiReady().toString() + "]");
		if (ANCILECSH.Utilities.isUiReady()) {
			ANCILECSH.HelpButton.create();
			ANCILECSH.HelpPanel.create();
			if (ANCILECSH.HelpButton.isCreated() && ANCILECSH.HelpPanel.isCreated()) {
				if (!ANCILECSH.HelpButton.isMultiple()) {
					// If single help button => don't need this timer anymore
					sap.ui.getCore().detachIntervalTimer(private.onSapUiCoreIntervalTimer);
				}
			}
		}
	};
	
	private.updateLastActedControl = function(actedControlId) {
		var oldLastActedControlId = private.LastActedControlId;
		var target;
		if (actedControlId !== undefined && actedControlId !== null && actedControlId !== "") {
			target = document.getElementById(actedControlId);
			var t = target;
			// Find the real ui5 object
			while (t !== undefined && t !== null) {
				if (sap.ui.getCore().byId(t.id)) {
					actedControlId = t.id;
					target = document.getElementById(actedControlId);
					break;
				}
				t = t.parentElement;
			}
			if (!ANCILECSH.Utilities.isActionOnAncileHelpControls(target)) {
				private.LastActedControlId = actedControlId;
			}
		}
		else {
			actedControlId = sap.ui.getCore().getCurrentFocusedControlId();
			target = document.getElementById(actedControlId);
			if (!ANCILECSH.Utilities.isActionOnAncileHelpControls(target)) {
				private.LastActedControlId = actedControlId;
			}
		}
		if (private.LastActedControlId !== oldLastActedControlId) {
			$(ANCILECSH.Monitoring).trigger(ANCILECSH.Constants.EVENT_NAME_ACTED_CONTROL_CHANGE);
		}
	};
	
	private.updateLastActedView = function() {
		var oldLastActedViewId = private.LastActedViewId;
		if (private.LastActedControlId !== "" && private.LastActedControlId !== null && private.LastActedControlId !== undefined) {
			var t = document.getElementById(private.LastActedControlId);
			var found = false;
			while (t !== undefined && t !== null) {
				var v = sap.ui.getCore().byId(t.id);
				if (v !== undefined && v !== null) {
					if (v instanceof sap.ui.core.mvc.View) {
						found = true;
						private.LastActedViewId = t.id;
						break;
					}
				}
				t = t.parentElement;
			}
			if (!found) {
				private.LastActedViewId = "";
			}
		}
		else {
			private.LastActedViewId = "";
		}
		if (private.LastActedViewId !== oldLastActedViewId) {
			$(ANCILECSH.Monitoring).trigger(ANCILECSH.Constants.EVENT_NAME_ACTED_VIEW_CHANGE);
		}
	};
	
	private.onDomSubTreeModified = function(e) {
        if (!ANCILECSH.Utilities.isActionOnAncileHelpControls(e.target)) {
            if (private.checkUiChanges()) {
                $(ANCILECSH.Monitoring).trigger(ANCILECSH.Constants.EVENT_NAME_UI_CHANGE);
            }
        }
	};
	
	private.onSapUiUpdated = function() {
		if (private.checkUiChanges()) {
			$(ANCILECSH.Monitoring).trigger(ANCILECSH.Constants.EVENT_NAME_UI_CHANGE);
		}
	};
	
	private.onTouchStart = function(e) {
		var touches = e.originalEvent.changedTouches;
		var first = touches[0];
		private.updateLastActedControl(first.target.id);
		private.updateLastActedView();
	};
	
	private.onMouseDown = function(e) {
		private.updateLastActedControl(e.target.id);
		private.updateLastActedView();
	};
	
	private.onMouseClick = function(e) {
		private.updateLastActedControl(e.target.id);
		private.updateLastActedView();
	};
	
	private.onKeyDown = function(e) {
		private.updateLastActedControl(e.target.id);
		private.updateLastActedView();
	};
	
	private.onKeyPress = function(e) {
		private.updateLastActedControl(e.target.id);
		private.updateLastActedView();
	};
	
	private.onFocusIn = function(/*e*/) {
		
	};
	
	public.start = function() {
		sap.ui.getCore().attachIntervalTimer(private.onSapUiCoreIntervalTimer);
		sap.ui.getCore().attachEvent("UIUpdated", private.onSapUiUpdated);
		$(document.body).on("DOMSubtreeModified", ANCILECSH.Utilities.throttle(private.onDomSubTreeModified, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("DOMFocusIn", "*", ANCILECSH.Utilities.throttle(private.onFocusIn, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("mousedown", "*", ANCILECSH.Utilities.throttle(private.onMouseDown, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("touchstart", "*", ANCILECSH.Utilities.throttle(private.onTouchStart, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("click", "*", ANCILECSH.Utilities.throttle(private.onMouseClick, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("keydown", "*", ANCILECSH.Utilities.throttle(private.onKeyDown, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("keypress", "*", ANCILECSH.Utilities.throttle(private.onKeyPress, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).on("focusin", "*", ANCILECSH.Utilities.throttle(private.onFocusIn, ANCILECSH.Configuration.Monitoring.EventFrequency));	
	};
	
	public.stop = function() {
		sap.ui.getCore().dettachIntervalTimer(private.onSapUiCoreIntervalTimer);
		sap.ui.getCore().dettachEvent("UIUpdated", private.onSapUiUpdated);
		$(document.body).off("DOMSubtreeModified", ANCILECSH.Utilities.throttle(private.onDomSubTreeModified, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("DOMFocusIn", "*", ANCILECSH.Utilities.throttle(private.onFocusIn, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("touchstart", "*", ANCILECSH.Utilities.throttle(private.onTouchStart, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("mousedown", "*", ANCILECSH.Utilities.throttle(private.onMouseDown, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("click", "*", ANCILECSH.Utilities.throttle(private.onMouseClick, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("keydown", "*", ANCILECSH.Utilities.throttle(private.onKeyDown, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("keypress", "*", ANCILECSH.Utilities.throttle(private.onKeyPress, ANCILECSH.Configuration.Monitoring.EventFrequency));
		$(document.body).off("focusin", "*", ANCILECSH.Utilities.throttle(private.onFocusIn, ANCILECSH.Configuration.Monitoring.EventFrequency));	
	};
	
	public.getLastActedControlId = function() {
		return private.LastActedControlId;	
	};
	
	public.getLastActedViewId = function() {
		return private.LastActedViewId;
	};
	
	public.getLastActedViewName = function() {
		var view = sap.ui.getCore().byId(private.LastActedViewId);
		if (view && view.getViewName) {
			return view.getViewName();	
		}
		return "";
	};
	
	public.init = function() {
		// Start monitoring
		ANCILECSH.Monitoring.start();
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.Monitoring);
	};

})({});