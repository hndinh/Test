// <copyright file="helpbutton.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Help Button class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.HelpButton = ANCILECSH.HelpButton || new (function(private, public) { 
	
	public = this;
	
	private.Index = 0;
	
	private.Id = "";
	
	private.SnapToEdgeAnimationDuration = 200;
	
	private.IsCreated = false;
	
	private.onAncileHelpButtonPressed = function() {
		// Show last acted control
		ANCILECSH.Console.debug("Call for help LastActedControlId[" + ANCILECSH.Monitoring.getLastActedControlId() + "] LastActedViewId[" + ANCILECSH.Monitoring.getLastActedViewId() + "]");
		// Make help call
		var context = ANCILECSH.Context.getCurrentContextData();
		// Show
		ANCILECSH.HelpPanel.show(context);
	};
	
	private.getLastPosition = function() {
        if (ANCILECSH.Configuration.HelpButton.RememberLastPosition) {
            var d = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_BUTTON_LAST_DIRECTION);
            var t = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_BUTTON_LAST_TOP);
            if (d !== "" || t!== "") {
                return { Direction: d, Top: t };
            }
        }
		return null;
	};
	
	private.setLastPosition = function(isOnLeft, top) {
        if (ANCILECSH.Configuration.HelpButton.RememberLastPosition) {
            ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_BUTTON_LAST_DIRECTION, isOnLeft ? "left" : "right");
            ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_BUTTON_LAST_TOP, top);
        }
	};
	
	private.reposition = function(isPlayAnimation) {
		if (ANCILECSH.Configuration.HelpButton.Mode === ANCILECSH.Constants.HELP_BUTTON_MODE_FLOAT) {
			var isRTL = ANCILECSH.Utilities.isRTL();
			var isAppShifted = ANCILECSH.HelpPanel.isAppShifted();
			var helpPanelWidth = (isAppShifted) ? ANCILECSH.HelpPanel.getWidth() : 0;
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			var $helpButton = $("#"+private.Id);
			var helpButtonWidth = ANCILECSH.Utilities.cssWidthToNumber(ANCILECSH.Configuration.HelpButton.Width);
			var helpButtonHeight = ANCILECSH.Utilities.cssHeightToNumber(ANCILECSH.Configuration.HelpButton.Height);
			var helpButtonPosition = $helpButton.position();
			var leftEdge = (isAppShifted && !isRTL) ? helpPanelWidth : 0;
			var rightEdge = (isAppShifted && isRTL) ? (windowWidth - helpPanelWidth - helpButtonWidth) : (windowWidth - helpButtonWidth);
			var isOnLeft = helpButtonPosition.left < (windowWidth / 2);
			if (isRTL) {
				isOnLeft = helpButtonPosition.left < ((windowWidth - helpPanelWidth) / 2);
			}
			else {
				isOnLeft = (helpButtonPosition.left - helpPanelWidth) < ((windowWidth - helpPanelWidth) / 2);
			}
			if (ANCILECSH.Configuration.HelpButton.SnapToLeftAndRightEdges) {
				if (isOnLeft) {
					helpButtonPosition.left = leftEdge;
				}
				else {
					helpButtonPosition.left = rightEdge;
				}
				// Play animation (if any)
				if (isPlayAnimation) {
					$helpButton.css({
						"transition": (private.SnapToEdgeAnimationDuration/1000).toString() + "s",
						"-webkit-transition": (private.SnapToEdgeAnimationDuration/1000).toString() + "s",
						"-moz-transition": (private.SnapToEdgeAnimationDuration/1000).toString() + "s",
						"left": helpButtonPosition.left + "px"
					});
					// Wait until the animation stop
					var t = setTimeout(function() {
						// Clear animation
						$helpButton.css({
							"transition": "",
							"-webkit-transition": "",
							"-moz-transition": ""
						});
						// Save last position
						private.setLastPosition(isOnLeft, helpButtonPosition.top + "px");
						// Kill timer
						clearTimeout(t);
					}, private.SnapToEdgeAnimationDuration);
				}
			}
			// Make sure Help button is inside browser's viewport
			// ...
			if (helpButtonPosition.left <= leftEdge) {
				$helpButton.css({
					"left": leftEdge + "px"
				});
			}
			if (helpButtonPosition.top < 0) {
				$helpButton.css({
					"top": "0px"
				});
			}
			if (helpButtonPosition.left + helpButtonWidth > rightEdge) {
				$helpButton.css({
					"left": rightEdge + "px"
				});
			}
			if (helpButtonPosition.top + helpButtonHeight > windowHeight) {
				$helpButton.css({
					"top": (windowHeight - helpButtonHeight).toString() + "px"
				});
			}
			// Save last position
			private.setLastPosition(isOnLeft, helpButtonPosition.top + "px");
		}
	};
	
	private.initializePosition = function() {
        var isRTL = ANCILECSH.Utilities.isRTL();
		// Get browser viewport
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		// Get default position
		var direction = ANCILECSH.Configuration.HelpButton.Direction;
		var position = ANCILECSH.Configuration.HelpButton.Position;
		// Get last position (if any)
		var lastPosition = private.getLastPosition();
		// Calculate initial position
		var helpButtonWidth = ANCILECSH.Utilities.cssWidthToNumber(ANCILECSH.Configuration.HelpButton.Width);
		var initLeft;
		if (isRTL) {
            initLeft = (direction === ANCILECSH.Constants.HELP_BUTTON_DIRECTION_LEFT) ? (windowWidth - helpButtonWidth) : 0;
		}
		else {
		    initLeft = (direction === ANCILECSH.Constants.HELP_BUTTON_DIRECTION_RIGHT) ? (windowWidth - helpButtonWidth) : 0;
		}
		var initTop = ANCILECSH.Utilities.cssHeightToNumber(position);
		if (lastPosition !== null) {
            if (lastPosition.Direction === ANCILECSH.Constants.HELP_BUTTON_DIRECTION_LEFT) {
                initLeft = 0;
            }
            else {
                initLeft = windowWidth - helpButtonWidth;
            }
		}
		if (lastPosition !== null && lastPosition.Top !== "") {
			initTop = ANCILECSH.Utilities.cssHeightToNumber(lastPosition.Top);
		}
		$("#"+private.Id).css({
			"left": initLeft + "px",
			"right": "",
			"top": initTop + "px",
			"bottom": ""
		});
	};
	
	private.onWindowResize = function() {
		private.reposition(false);
	};
	
	private.onHelpPanelShow = function() {
		private.reposition(false);
	};
	
	private.onHelpPanelHide = function() {
		private.reposition(false);
	};
	
	private.onHelpPanelModeChange = function() {
		private.reposition(false);
	};
	
	private.onHelpPanelResizing = function() {
		private.reposition(false);
	};
	
	private.makeDraggable = function() {
		// Enable draggdrop
		$("#"+private.Id).draggable({
			iframeFix: true, // Fix drag over iframe
			containment: "window", // Only allow drag inside browser's viewport
			cancel: false, // Cancel mouse up action on button on dragdrop
			stop: function(/*event, ui*/) {
				private.reposition(true);
			}
		});
	};
	
	private.createSapUi5FloatButton = function(isSapM, isSapUiCommons) { 
    	// Get or create HTML DOM element to host the sapui5 button
		var htmlButtonElement = document.getElementById(ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON);
		if (htmlButtonElement === undefined || htmlButtonElement === null) {
			htmlButtonElement = document.createElement("div");
			htmlButtonElement.id = ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON;
			document.body.appendChild(htmlButtonElement);
		}
		// Create sapui5 button base on application type
		private.Id = ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON + (++private.Index).toString();
		var sapUi5Button = null;
		if (isSapM) {
			// Create sap.m.Button float button
			sapUi5Button = new sap.m.Button(private.Id);
		}
		else if (isSapUiCommons) {
			// Create sap.ui.commons.Button float button
			sapUi5Button = new sap.ui.commons.Button(private.Id);
		}
		if (sapUi5Button !== null && sapUi5Button !== undefined) {
			// Set basic attributes and place it in main htmlButtonElement
			sapUi5Button.setIcon(ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpButton.Icon));
			sapUi5Button.setTooltip(ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpButton.Text));
			sapUi5Button.attachPress(private.onAncileHelpButtonPressed);
			sapUi5Button.placeAt(ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON, "only");
			// Make it draggable
			var t = setInterval(function() {
				// Try to get HTML DOM of the button
				var htmlDomSapMButton = document.getElementById(sapUi5Button.getId());
				if (htmlDomSapMButton === undefined || htmlDomSapMButton === null) {
					// Not yet available, continue to wait
					return;
				}
				// Now we can access it
				// Set style & initial position
				var $htmlDomSapMButton = $(htmlDomSapMButton);
				$htmlDomSapMButton.css({
					"border-radius": ANCILECSH.Configuration.HelpButton.BorderRadius,
					"width": ANCILECSH.Configuration.HelpButton.Width,
					"height": ANCILECSH.Configuration.HelpButton.Height
				});
				$htmlDomSapMButton.children().first().css({
					"border-radius" : ANCILECSH.Configuration.HelpButton.BorderRadius
				});
				// Make the button draggable
				private.makeDraggable();
				// Restore last position
				private.initializePosition();
				// Reposition
				private.reposition(true);
				// Done, kill the timer
				clearInterval(t);
			}, 100);
		}
		// End
		return sapUi5Button !== null;
	};
	
	private.createSapUi5DockButton = function(fragment, htmlPlacementElement) {
		var sapUi5Button = null;
		if (fragment !== null) {
			// Get or create HTML DOM element to host the sapui5 button
			var htmlButtonElement = document.getElementById(ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON);
			if (htmlButtonElement === undefined || htmlButtonElement === null) {
				htmlButtonElement = document.createElement("div");
				htmlButtonElement.id = ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON;
				document.body.appendChild(htmlButtonElement);
			}
			// Create the fragment
			if (fragment.XML !== null && fragment.XML !== undefined && fragment.XML !== "") {
				var xmlFragmentContent = fragment.XML.replace("%ID%", ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON + (++private.Index).toString());
				sapUi5Button = sap.ui.xmlfragment({
					fragmentContent : xmlFragmentContent
				});
				if (sapUi5Button !== null) {
					// Get sapui5 placement object
					var sapUi5PlacementObject = sap.ui.getCore().byId(htmlPlacementElement.id);
					if (sapUi5PlacementObject !== null && sapUi5PlacementObject !== undefined) {
						// Place it into correct location
						ANCILECSH.Utilities.callObjectMethod(sapUi5PlacementObject, fragment.PlacementMethod, sapUi5Button);
						// Set icon
						ANCILECSH.Utilities.callObjectMethod(sapUi5Button, fragment.SetIconMethod, ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpButton.Icon));
						// Set tooltip
						ANCILECSH.Utilities.callObjectMethod(sapUi5Button, fragment.SetTooltipMethod, ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpButton.Text));
						// Set pressed event
						ANCILECSH.Utilities.callObjectMethod(sapUi5Button, fragment.AttachPressMethod, private.onAncileHelpButtonPressed);
					}
				}
			}
		}
		// Return
		return sapUi5Button !== null;
	};
	
	private.createAncileHelpButton = function() {
        var done = false;
		// Check Ui status
		if (ANCILECSH.Utilities.isUiReady()) {
			// Create Help button when UI is ready
			// Recognize application
			//ANCILECSH.Console.debug("Recognizing application...");
			var	application = ANCILECSH.ApplicationRecognizer.recognizeApplication();
			if (application !== null) {
				switch (ANCILECSH.Configuration.HelpButton.Mode) {
					case ANCILECSH.Constants.HELP_BUTTON_MODE_FLOAT:
						if (!private.IsCreated) {
							done = private.createSapUi5FloatButton(application.IsSapM, application.IsSapUiCommons);
						}
						else {
							done = true;
						}
						break;
					case ANCILECSH.Constants.HELP_BUTTON_MODE_DOCK:
					default:
						// Get the help button in application definition, and find HTML DOM element
						$(application.HelpButton.Position).each(function(j, htmlPlacementElement) {
							//ANCILECSH.Console.debug(htmlDomElement);
							// Make sure we don't create Help button twice
							if (!ANCILECSH.Utilities.isAncileHelpButtonExist(htmlPlacementElement)) {
								//ANCILECSH.Console.debug(htmlDomElement);
								done = private.createSapUi5DockButton(application.HelpButton.Fragment, htmlPlacementElement);
								if (done) {
									return false; // break
								}
							}
							else {
								done = true;
								return false; // break
							}
						});
						break;
				}
			}
		}
		else {
			ANCILECSH.Utilities.delayCall(private.createAncileHelpButton, 100);
			return false;
		}
		private.IsCreated = private.IsCreated || done;
		return private.IsCreated;
	};
	
	private.hide = function() {
		$("*[id*='" + ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON + "']").css({
			"display": "none"
		});
	};
	
	private.show = function() {
		$("*[id*='" + ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON + "']").css({
			"display": ""
		});
	};
	
	public.isCreated = function() {
		return private.IsCreated;	
	};
	
	public.isMultiple = function() {
		if (ANCILECSH.Configuration.HelpButton.Mode === ANCILECSH.Constants.HELP_BUTTON_MODE_DOCK) {
			// In 'dock' mode, we may need to add help button to dialog => multiple help button
			return true;
		}
		else if (ANCILECSH.Configuration.HelpButton.Mode === ANCILECSH.Constants.HELP_BUTTON_MODE_FLOAT) {
			// In 'float' mode, we only need one help button => single help button
			return false;
		}
		return false;
	};
	
	public.hide = function() {
		private.hide();
	};
	
	public.show = function() {
		private.show();
	};

	public.create = function() {
		private.createAncileHelpButton();
	};
	
	public.delete = function() {
		$("*[id*='" + ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON + "']").remove();
		private.IsCreated = false;
	};
	
	public.init = function() {
		// Include jQueryUI plugins
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");
		// Enable jQueryUI touch draggable
		ANCILECSH.Utilities.jQueryUiTouchable();
		// Monitor these event to reposition help button correctly
		$(ANCILECSH.HelpPanel).on(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_SHOW, private.onHelpPanelShow);
		$(ANCILECSH.HelpPanel).on(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_HIDE, private.onHelpPanelHide);
		$(ANCILECSH.HelpPanel).on(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_MODE_CHANGE, private.onHelpPanelModeChange);
		$(ANCILECSH.HelpPanel).on(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_RESIZING, private.onHelpPanelResizing);
		$(window).on(ANCILECSH.Constants.EVENT_NAME_WINDOW_RESIZE, private.onWindowResize);
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.HelpButton);
	};

})({});