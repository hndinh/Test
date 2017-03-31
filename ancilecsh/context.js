// <copyright file="context.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Context class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.Context = ANCILECSH.Context || new (function(private, public) { 
	
	public = this;
	
	private.CurrentPrimaryCsh = "";
	
	private.CurrentSecondaryCsh = "";
	
	private.CurrentTertiaryCsh = "";
	
	private.getAllViews = function() {
		var allViews = [];
		for(var iViewRecognizer = 0; iViewRecognizer < ANCILECSH.Configuration.Context.ViewRecognizer.length; iViewRecognizer++){
			$(ANCILECSH.Configuration.Context.ViewRecognizers[iViewRecognizer].Pattern).each(function (i, v) {
				var isInExceptionList = false;
				for (var j=0; j<ANCILECSH.Configuration.Context.ViewRecognizers[iViewRecognizer].Exceptions.length; j++) {
					if (ANCILECSH.Configuration.Context.ViewRecognizers[iViewRecognizer].Exceptions[j].indexOf(">") === 0 || 
						ANCILECSH.Configuration.Context.ViewRecognizers[iViewRecognizer].Exceptions[j].indexOf(" ") === 0) { 
						// Exception selector starts with '>' or ' ' then it is on child of current element
						// Note: '>' is any direct child, ' ' is any descendant
						if ($("#" + v.id + ANCILECSH.Configuration.Context.ViewRecognizers[iViewRecognizer].Exceptions[j]).length > 0) {
							isInExceptionList = true;
							break;
						}
					}
					else {
						 // Otherwise, it is on parent or same current element
						if ($(ANCILECSH.Configuration.Context.ViewRecognizers[iViewRecognizer].Exceptions[j] + "#" + v.id).length > 0) {
							isInExceptionList = true;
							break;
						}
					}
				}
				if (!isInExceptionList) {
					var view = sap.ui.getCore().byId(v.id);
					if (view !== undefined && view !== null) {
						if (view instanceof sap.ui.core.mvc.View) {
							allViews.push(view);
						}
					}
				}
			});
		}	
		return allViews;
	};
	
	private.getPrimaryCsh = function() {
		var primaryCsh = "";
		var allViews = private.getAllViews();
		$(allViews).each(function(i, view) {
			primaryCsh += view.getViewName();
		});
		primaryCsh = primaryCsh.split(ANCILECSH.Constants.SEPARATOR_CONTEXT_DATA).join("");
		return primaryCsh;
	};
	
	private.getSecondaryCsh = function() {
		var secondaryCsh = "";
		var actedViewName = ANCILECSH.Monitoring.getLastActedViewName();
		if (actedViewName) {
			// Has last acted view
			secondaryCsh = actedViewName;
		}
		else {
			// Last acted view is null => get the first view
			var allViews = private.getAllViews();
			if (allViews) {
				secondaryCsh = allViews[0].getViewName();
			}
		}
		secondaryCsh = secondaryCsh.split(ANCILECSH.Constants.SEPARATOR_CONTEXT_DATA).join("");
		return secondaryCsh;
	};
	
	private.getTertiaryCsh = function() {
		var tertiaryCsh = "";
		// var t = document.getElementById(ANCILECSH.Monitoring.getLastActedControlId());
		// while (t !== undefined && t !== null) {
		// 	var controlId = t.id;
		// 	var stableId = private.getStableId(controlId);
		// 	if (stableId !== "") {
		// 		tertiaryCsh = stableId;
		// 		break;
		// 	}
		// 	else {
		// 		var v = sap.ui.getCore().byId(controlId);
		// 		if (v !== undefined && v !== null) {
		// 			if (v instanceof sap.ui.core.mvc.View) {
		// 				// Reach the view where the control is placed => stop;
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	t = t.parentElement;
		// }
		// tertiaryCsh = tertiaryCsh.split(ANCILECSH.Constants.SEPARATOR_CONTEXT_DATA).join("");
		return tertiaryCsh;
	};
	
	private.getStableId = function(id) {
		if (id !== "") {
			if (id.search(ANCILECSH.Constants.REGEX_STABLE_SAPUI5_ID) >= 0) {
				return id.replace(ANCILECSH.Constants.REGEX_STABLE_SAPUI5_ID, "");
			}
			else if (id.search(ANCILECSH.Constants.REGEX_AUTO_GENERATED_SAPUI5_ID) >= 0) {
				return "";
			}
			else {
				return id;
			}
		}
		return "";
	};
	
	private.exposeContextData = function() {
	    // Check if Help button is created
		if (!ANCILECSH.HelpButton.isCreated()) {
            // Delay this call if Help button has not been created
			ANCILECSH.Utilities.delayCall(private.exposeContextData, 100);
			return;
		}
		// Get HTML DOM Element with id 'ancile-help-button'
		var $htmlDomHelpButton = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON);
		// Get or Create HTML DOM Element with id 'ancile-help-context-data'
		var $htmlDomContextData = $htmlDomHelpButton.children("#" + ANCILECSH.Constants.ID_ANCILE_HELP_CONTEXT_DATA);
		if ($htmlDomContextData.length <= 0) {
			$htmlDomContextData = $("<div id='" + ANCILECSH.Constants.ID_ANCILE_HELP_CONTEXT_DATA + "'></div>");
			$htmlDomHelpButton.append($htmlDomContextData);
		}
		// Get or Create HTML DOM Element with id 'primary-csh'
		var $htmlDomPrimaryCsh = $htmlDomContextData.children("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PRIMARY_CSH);
		if ($htmlDomPrimaryCsh.length <= 0) {
			$htmlDomPrimaryCsh = $("<div id='" + ANCILECSH.Constants.ID_ANCILE_HELP_PRIMARY_CSH + "'></div>");
			$htmlDomContextData.append($htmlDomPrimaryCsh);
		}
		// Get or Create HTML DOM Element with id 'secondary-csh'
		var $htmlDomSecondaryCsh = $htmlDomContextData.children("#" + ANCILECSH.Constants.ID_ANCILE_HELP_SECONDARY_CSH);
		if ($htmlDomSecondaryCsh.length <= 0) {
			$htmlDomSecondaryCsh = $("<div id='" + ANCILECSH.Constants.ID_ANCILE_HELP_SECONDARY_CSH + "'></div>");
			$htmlDomContextData.append($htmlDomSecondaryCsh);
		}
		// Get or Create HTML DOM Element with id 'teriary-csh'
		var $htmlDomTertiaryCsh = $htmlDomContextData.children("#" + ANCILECSH.Constants.ID_ANCILE_HELP_TERTIARY_CSH);
		if ($htmlDomTertiaryCsh.length <= 0) {
			$htmlDomTertiaryCsh = $("<div id='" + ANCILECSH.Constants.ID_ANCILE_HELP_TERTIARY_CSH + "'></div>");
			$htmlDomContextData.append($htmlDomTertiaryCsh);
		}
		// Get or Create HTML DOM Element with id 'ancile-help-acted-control'
		var $htmlDomActedControl = $htmlDomContextData.children("#" + ANCILECSH.Constants.ID_ANCILE_HELP_ACTED_CONTROL);
		if ($htmlDomActedControl.length <= 0) {
			$htmlDomActedControl = $("<div id='" + ANCILECSH.Constants.ID_ANCILE_HELP_ACTED_CONTROL + "'></div>");
			$htmlDomContextData.append($htmlDomActedControl);
		}
		// Expose to HTML DOM
		// Acted control ID
		$htmlDomActedControl.text(ANCILECSH.Monitoring.getLastActedControlId());
		// Primary CSH
		private.CurrentPrimaryCsh = private.getPrimaryCsh();
		$htmlDomPrimaryCsh.text(private.CurrentPrimaryCsh);
		// Secondary CSH
		private.CurrentSecondaryCsh = private.getSecondaryCsh();
		$htmlDomSecondaryCsh.text(private.CurrentSecondaryCsh);
		// Tertiary CSH
		private.CurrentTertiaryCsh = private.getTertiaryCsh();
		$htmlDomTertiaryCsh.text(private.CurrentTertiaryCsh);
	};
	
	public.getCurrentContextData = function() {
        // Do not call getPrimaryCsh(), getSecondaryCsh(), getTertiaryCsh() here
        // Reason: Those function re-calculate Csh of current screen, which is not what we expected
        //         We expect to return the last user's action context data, which is currently store in HTML DOM
        // We will go there and collect it
		var primaryCsh = private.CurrentPrimaryCsh;
		var secondaryCsh = private.CurrentSecondaryCsh;
		//var tertiaryCsh = private.CurrentTertiaryCsh;
		var context = primaryCsh;
		if (secondaryCsh !== "") {
			context = context + ANCILECSH.Constants.SEPARATOR_CONTEXT_DATA + secondaryCsh;
		}
		/*if (tertiaryCsh !== "") {
			context = context + ANCILECSH.Constants.SEPARATOR_CONTEXT_DATA + tertiaryCsh;
		}*/
		return context;
	};
	
	public.init = function() {
		// Monitor these events to collect context data
		// Do not expose context data on UI change, we cannot control when SAPUI5 library trigger this event
		// Only expose context data on UI change on first time, .one() is used
		$(ANCILECSH.Monitoring).one(ANCILECSH.Constants.EVENT_NAME_UI_CHANGE, private.exposeContextData);
		$(ANCILECSH.Monitoring).on(ANCILECSH.Constants.EVENT_NAME_ACTED_VIEW_CHANGE, private.exposeContextData);
		$(ANCILECSH.Monitoring).on(ANCILECSH.Constants.EVENT_NAME_ACTED_CONTROL_CHANGE, private.exposeContextData);
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.Context);
	};

})({});
