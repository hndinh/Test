// <copyright file="helppanel.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Help Panel class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.HelpPanel = ANCILECSH.HelpPanel || new (function(private, public) { 
	
	public = this;
	
	private.IsCreated = false;
	
	private.IsVisible = false;
	
    private.Popup = null;
	
	private.IsSapM = false;
	
	private.IsSapUiCommons = false;
	
	private.HtmlDomHelpPanel = null;
	
	private.SapUi5HtmlControl = null;
	
	private.SapUi5CloseButton = null;
	
	private.SapUi5SwitchModeButton = null;
	
	private.SapUi5SwitchModeDropDownMenu = null;
	
	private.SapUi5FloatModeMenuItem = null;
	
	private.SapUi5DockModeMenuItem = null;
	
	private.SapUi5PopoutModeMenuItem = null;
	
	private.AppShiftingStatus = [];
	
	private.CurrentContext = null;
	
	private.Mode = "";
	
	private.Left = "";
	
	private.Top = "";
	
	private.Width = "";
	
	private.Height = "";
	
	private.createHtmlDomHelpPanel = function() {
		private.HtmlDomHelpPanel = document.getElementById(ANCILECSH.Constants.ID_ANCILE_HELP_PANEL);
		if (!private.HtmlDomHelpPanel) {
			private.HtmlDomHelpPanel = document.createElement("div");
			private.HtmlDomHelpPanel.id = ANCILECSH.Constants.ID_ANCILE_HELP_PANEL;
			private.HtmlDomHelpPanel.style.top = "-1px";
			private.HtmlDomHelpPanel.style.left = "-9999px";
			private.HtmlDomHelpPanel.style.width = ANCILECSH.Configuration.HelpPanel.Width;
			private.HtmlDomHelpPanel.style.height = "calc(100% - 1px)";
			document.body.appendChild(private.HtmlDomHelpPanel);
		}
	};
	
	private.setHelpContent = function(context, onload) {
		private.CurrentContext = context;
		var iOS = ANCILECSH.Utilities.isiOS();
		if (iOS) {
            // iOS only
            // In iOS, the iframe is always full-size, therefore, we must add scrollbars into its parent
            var html = "<div id='" + ANCILECSH.Constants.ID_IOS_SCROLL_FRAME + "'>";
                html += "<iframe style='width:100%; height:100%; display:block;' frameBorder='0'></iframe>";
                html += "</div>";
            private.SapUi5HtmlControl.setContent(html);
		}
		else {
            private.SapUi5HtmlControl.setContent("<iframe style='width:100%; height:100%; display:block;' frameBorder='0'></iframe>");		    
		}
		// Wait until the iframe HTML DOM is accessible
		var t = setInterval(function(){
			var $iframe = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " iframe");
			if ($iframe.length > 0) {
                // Load content URL
                $iframe[0].src = ANCILECSH.Configuration.HelpServer.URL + context + "&reposition=false";
				// Trick to fix uPS cannot be displayed inside iframe in Citrix
				// We need to toggle 'display' style attribute, so that the browser will render content correctly
				// We start by switching 'display' style attribute to '' (inline) when the uPS is loaded
				// After a short time 1ms, we set it back to 'block'
				$iframe.off("load").on("load", function() {
                    // Call 'onload'
                    if (onload) {
                        onload();
                        onload = null; // Avoid call twice
                    }
					// It starting to load => set 'display' to '' (inline)
					$iframe.css({
						"display": ""
					});
					var tt = setTimeout(function() {
						// After a short time, set it back to 'block'
						$iframe.css({
							"display": "block",
							"width": "100%",
							"height": "100%",
							"left": "",
							"top": "",
							"position": ""
						});
						clearTimeout(tt);
					}, 1);
				});
				clearInterval(t);
			}
		}, 100);
	};
	
	private.shiftApp = function(isShifting) {
		var isRTL = ANCILECSH.Utilities.isRTL();
		if (isShifting && private.AppShiftingStatus.length <= 0) {
			// Shift main app to the right
			// Find Sap Ui Area (visible, has attribute data-sap-ui-area, not ancile help button or help panel)
			var sapUiAreaId = $(ANCILECSH.Configuration.ShiftApp.UiArea)[0].id;
			if (sapUiAreaId !== undefined && sapUiAreaId !== null && sapUiAreaId !== "" && sap.ui.getCore().getUIArea(sapUiAreaId) !== null) {
				// Found Sap Ui Area
				var shiftingUiElements = [];
				if (private.IsSapUiCommons) {
                    $(ANCILECSH.Configuration.ShiftApp.SapUiCommons.ShiftElements).each(function(i, e) {
                        shiftingUiElements = shiftingUiElements.concat($("#" + sapUiAreaId + e).toArray());
                    });
				}
				else if (private.IsSapM) {
                    $(ANCILECSH.Configuration.ShiftApp.SapM.ShiftElements).each(function(i, e) {
                        shiftingUiElements = shiftingUiElements.concat($("#" + sapUiAreaId + e).toArray());
                    });
				}
				if (shiftingUiElements.length > 0) {
					$(shiftingUiElements).each(function(i, ui) {
						var $ui = $(ui);
						var margin = isRTL ? $ui.css("margin-right") : $ui.css("margin-left");
						if (margin !== "") {
							var finalMargin = "calc(" + margin + " + " + private.Width + ")";
							if (isRTL) {
								$ui.css({
									"margin-right": finalMargin
								});
							}
							else {
								$ui.css({
									"margin-left": finalMargin
								});
							}
						}
						else {
							if (isRTL) {
								$ui.css({
									"margin-right": private.Width
								});
							}
							else {
								$ui.css({
									"margin-left": private.Width
								});
							}
						}
						private.AppShiftingStatus.push({
							id: ui.id,
							margin: margin
						});
					});
				}
			}
		}
		else {
			// Restore to the state before show Help panel
			$(private.AppShiftingStatus).each(function(j, status) {
				if (isRTL) {
					$("#" + status.id).css({
						"margin-right": status.margin
					});
				}
				else {
					$("#" + status.id).css({
						"margin-left": status.margin
					});
				}
			});
			private.AppShiftingStatus = [];
		}
	};
	
	private.onMoved = function(/*event, ui*/) {
		// Save last position
		private.Left = $(private.HtmlDomHelpPanel).position().left + "px";
		private.Top = $(private.HtmlDomHelpPanel).position().top + "px";
		private.setLastPosition(ANCILECSH.HelpPanel.getMode(), private.Left, private.Top);
	};
	
	private.makeDraggable = function(isEnabled) {
		$(private.HtmlDomHelpPanel).draggable({
			disabled: !isEnabled, // Disable?
			iframeFix: true, // Fix drag over iframe
			containment: "window", // Only allow drag inside browser's viewport
			cancel: false, // Cancel mouse up action on button on dragdrop
			stop: private.onMoved
		});
	};
	
	private.onResizing = function(event, ui) {
		if (ANCILECSH.HelpPanel.isDock()) {
			var isRTL = ANCILECSH.Utilities.isRTL();
			$(private.AppShiftingStatus).each(function(i, status) {
				var width = ui.size.width;
				if (isRTL) {
					$("#" + status.id).css({
						"margin-right": width.toString() + "px"
					});
				}
				else {
					$("#" + status.id).css({
						"margin-left": width.toString() + "px"
					});
				}
			});
		}
		$(ANCILECSH.HelpPanel).trigger(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_RESIZING);
	};
	
	private.onResized = function(/*event, ui*/) {
        private.Width = $(private.HtmlDomHelpPanel).width() + "px";
        private.Height = !ANCILECSH.HelpPanel.isDock() ? $(private.HtmlDomHelpPanel).height() + "px" : ANCILECSH.Configuration.HelpPanel.Height;
		private.setLastSize(private.Width, private.Height);
		$(ANCILECSH.HelpPanel).trigger(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_RESIZED);
	};
	
	private.makeResizable = function(isEnabled) {
		var isRTL = ANCILECSH.Utilities.isRTL();
		var $allHandles;
		$(private.HtmlDomHelpPanel).resizable({
			disabled: !isEnabled, // Disable?
			handles: "n, e, s, w, ne, se, sw, nw",
			start: function(/*event, ui*/) {
                // The help panel contains an <iframe>
                // Dragging over this <iframe> is not smooth, there's a trick to fix it
                // We get the current using resize handle and set it to over the <iframe> by add a custom CSS style class
                // Definition of this CSS style class is place in ancilecsh.css
                var axis = $(private.HtmlDomHelpPanel).data(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE).axis;
                if (axis) {
                    var $usedHandle = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " ." + ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE + "-" + axis);
                    $usedHandle.addClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_IFRAMEFIX);  
                }
			},
			resize: private.onResizing,
			stop: function(event, ui) {
                private.onResized(event, ui);
                // Done fixing iframe issue
                // Remove custom CSS style class
                var axis = $(private.HtmlDomHelpPanel).data(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE).axis;
                if (axis) {
                    var $usedHandle = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " ." + ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE + "-" + axis);
                    $usedHandle.removeClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_IFRAMEFIX);  
                }
			}
		});
		$allHandles = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " ." + ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_HANDLE); 
		if (ANCILECSH.HelpPanel.isDock()) {
			// Hide all handles
			$allHandles.addClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_HIDDEN_HANDLE);
			if (isRTL) {
				// Just show 'w' handle
				var $wHandle = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " ." + ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_W);
				$wHandle.removeClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_HIDDEN_HANDLE);
			}
			else {
				// Just show 'e' handle
				var $eHandle = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " ." + ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_E);
				$eHandle.removeClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_HIDDEN_HANDLE);
			}
		}
		else {
			$allHandles.removeClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_HIDDEN_HANDLE);
		}
		// Set South East resize handle icon
		// We cannot asign background image in css file, because the URL will be invalid in Fiori Launchpad
		// We need to set background image as in-line style
		var seHandle = $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + " ." + ANCILECSH.Constants.CSS_CLASS_JQUERYUI_RESIZABLE_SE);
		// Remove default jQueryUI styles that may reference to jQueryUI resources
		seHandle.removeClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_ICON);
		seHandle.removeClass(ANCILECSH.Constants.CSS_CLASS_JQUERYUI_ICON_GRIPSMALL_DIAGONAL_SE);
		// Set new background
		seHandle.css({
            "background-image": "url(" + ANCILECSH.CurrentLocation + "img/resize-handle.png)",
            "background-position": "right bottom",
            "background-repeat": "no-repeat"
		});
	};
	
	private.reposition = function(isSwitchMode) {
		var isRTL = ANCILECSH.Utilities.isRTL();
		var $helpPanel = $(private.HtmlDomHelpPanel);
		var helpPanelPosition = $helpPanel.position();
		var windowWidth = $(window).width();
		// var windowHeight = $(window).height();
		var helpPanelWidth = private.Width;
		var helpPanelHeight = private.Height;
		if (ANCILECSH.HelpPanel.isFloat()) {
			// Make resizable
			private.makeResizable(true);
			// Make it draggable
			private.makeDraggable(true);
			// If switch mode, make a visual effect
			if (isSwitchMode) {
                private.Left = (isRTL ? (helpPanelPosition.left - 10) : (helpPanelPosition.left + 10)).toString() + "px";
                private.Top = (helpPanelPosition.top + 10).toString() + "px";
			}
			$helpPanel.css({
				"left": private.Left,
				"top": private.Top,
				"width": helpPanelWidth,
                "height": helpPanelHeight
			});
		}
		else if (ANCILECSH.HelpPanel.isDock()) {
			// Make resizable
			private.makeResizable(true);
			// Switch to dock mode
			private.makeDraggable(false);
			// If switch mode
			if (isSwitchMode) {
                private.Left = (isRTL ? (windowWidth - ANCILECSH.Utilities.cssWidthToNumber(helpPanelWidth)) : 0).toString() + "px";
                private.Top = "-1px";
			}
			// Set position
			helpPanelPosition.left = isRTL ? (windowWidth - ANCILECSH.Utilities.cssWidthToNumber(helpPanelWidth)) : 0;
			$helpPanel.css({
				"left": helpPanelPosition.left.toString() + "px",
				"top": "-1px",
				"width": helpPanelWidth,
				"height": "calc(100% - 1px)"
			});
		}
        // Save last position
        private.setLastPosition(ANCILECSH.HelpPanel.getMode(), $helpPanel.position().left + "px", $helpPanel.position().top + "px");
	};
	
	private.setLastPosition = function(mode, left, top) {
		if (ANCILECSH.Configuration.HelpPanel.RememberLastPosition) {
            ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_MODE, mode);
            if (ANCILECSH.HelpPanel.isFloat()) {
                ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_LEFT, left);
                ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_TOP, top);
            }
            else {
                ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_LEFT, "");
                ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_TOP, "");
            }
		}
	};
	
	private.setLastSize = function(width, height) {
        if (ANCILECSH.Configuration.HelpPanel.RememberLastSize) {
            ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_WIDTH, width);
            if (ANCILECSH.HelpPanel.isFloat()) {
                ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_HEIGHT, height);
            }
            else {
                ANCILECSH.Utilities.setUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_HEIGHT, "");
            }
        }
	};
	
	private.initializePositionAndSize = function() {
        if (ANCILECSH.Configuration.HelpPanel.RememberLastSize) {
            private.Width = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_WIDTH) || ANCILECSH.Configuration.HelpPanel.Width;
            private.Height = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_HEIGHT) || ANCILECSH.Configuration.HelpPanel.Height;
        }
        else {
            private.Width = ANCILECSH.Configuration.HelpPanel.Width;
            private.Height = ANCILECSH.Configuration.HelpPanel.Height;
        }
        if (ANCILECSH.Configuration.HelpPanel.RememberLastPosition) {
            private.Mode = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_MODE) || ANCILECSH.Configuration.HelpPanel.Mode;
            private.Left = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_LEFT);
            private.Top = ANCILECSH.Utilities.getUserData(ANCILECSH.Constants.USERDATA_ANCILE_HELP_PANEL_LAST_TOP);
        }
        else {
            private.Mode = ANCILECSH.Configuration.HelpPanel.Mode;
            if (ANCILECSH.HelpPanel.isDock()) {
                private.Left = "0px";
                private.Top = "-1px";
            }
            else if (ANCILECSH.HelpPanel.isFloat()) {
                if (ANCILECSH.Utilities.isRTL()) {
                    private.Left = ($(window).width() - private.Width - 10).toString() + "px";
                    private.Top = "10px";
                }
                else {
                    private.Left = "10px";
                    private.Top = "10px";
                }
            }
            else if (ANCILECSH.HelpPanel.isPopout()) {
                private.Left = "0px";
                private.Top = "0px";
            }
        }
		if (private.Width !== "") {
            $(private.HtmlDomHelpPanel).css({
                "width": private.Width
            });
		}
		if (private.Height !== "") {
            $(private.HtmlDomHelpPanel).css({
                "height": private.Height
            });
		}
	};
	
	private.hide = function() {
		if (ANCILECSH.HelpPanel.isPopout()) {
			// Set visible to false
			private.IsVisible = false;
		}
		else if (ANCILECSH.HelpPanel.isFloat() || ANCILECSH.HelpPanel.isDock()) {
            if (private.HtmlDomHelpPanel !== null) {
				private.HtmlDomHelpPanel.style.left = "-9999px";
			}
			// Shift app
			private.shiftApp(false);
			// Set visible to false
			private.IsVisible = false;
			// Raise event onhide
			$(ANCILECSH.HelpPanel).trigger(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_HIDE);
		}
	};
    
	private.show = function(context) {
		if (ANCILECSH.HelpPanel.isPopout()) { // Popout mode
            // Set Visible to true
			private.IsVisible = true;
            // Open new browser window
			var url = ANCILECSH.Configuration.HelpServer.URL + context + "&reposition=false";
			var title = ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.Title);
			var options = "left=0,";
			if (ANCILECSH.Utilities.isRTL()) {
				options = "left=" + (screen.width - ANCILECSH.Utilities.cssWidthToNumber(private.Width)).toString() + "px,";
			}
			options += "top=0,";
			options += "width=" + ANCILECSH.Utilities.cssWidthToNumber(private.Width).toString() + "px,";
			options += "height=" + ANCILECSH.Utilities.cssHeightToNumber(private.Height).toString() + "px,";
			options += "resizable=1,scrollbars=1";
			private.Popup = window.open(url, title, options);
		}
		else if (ANCILECSH.HelpPanel.isFloat() || ANCILECSH.HelpPanel.isDock()) { // float or dock mode
            // Hide it if it is currently shown
			private.hide();
			// Show it again
			private.IsVisible = true;
			if (private.HtmlDomHelpPanel !== null) {
                // Load new help content
                private.setHelpContent(context);
                // Reposition
                private.reposition(false);
                // Shift app
                if (ANCILECSH.HelpPanel.isDock()) {
                    private.shiftApp(true);
                }
                // Raise event onshow
                $(ANCILECSH.HelpPanel).trigger(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_SHOW);
			}
		}
	};
	
	private.showSwitchModeDropDown = function() {
        // Show dropdown menu
        if (!private.SapUi5SwitchModeDropDownMenu) {
            private.SapUi5DockModeMenuItem = new sap.ui.unified.MenuItem({
                id: ANCILECSH.Constants.ID_ANCILE_HELP_PANEL_DOCK_MODE_MENUITEM,
                text: ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.DropDown.DockModeMenuItem.Text),
                icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.DropDown.DockModeMenuItem.Icon),
                select: function() {
                    var isFloat = ANCILECSH.HelpPanel.isFloat();
                    // Switch to dock mode
                    private.Mode = ANCILECSH.Constants.HELP_PANEL_MODE_DOCK;
                    // Reposition
                    private.reposition(isFloat);
                    // Shift app
                    private.shiftApp(true);
                    // Show hide buttons
                    private.SapUi5DockModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isDock());
                    private.SapUi5FloatModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isFloat());
                    // Raise event onmodechange
                    $(ANCILECSH.HelpPanel).trigger(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_MODE_CHANGE);
                }
            });
            private.SapUi5FloatModeMenuItem = new sap.ui.unified.MenuItem({
                id: ANCILECSH.Constants.ID_ANCILE_HELP_PANEL_FLOAT_MODE_MENUITEM,
                text: ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.DropDown.FloatModeMenuItem.Text),
                icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.DropDown.FloatModeMenuItem.Icon),
                select: function() {
                    var isDock = ANCILECSH.HelpPanel.isDock();
                    // Switch to dock mode
                    private.Mode = ANCILECSH.Constants.HELP_PANEL_MODE_FLOAT;
                    // Reposition
                    private.reposition(isDock);
                    // Shift app
                    private.shiftApp(false);
                    // Show hide buttons
                    private.SapUi5DockModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isDock());
                    private.SapUi5FloatModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isFloat());
                    // Raise event onmodechange
                    $(ANCILECSH.HelpPanel).trigger(ANCILECSH.Constants.EVENT_NAME_HELP_PANEL_MODE_CHANGE);
                }
            });
            private.SapUi5PopoutModeMenuItem = new sap.ui.unified.MenuItem({
                id: ANCILECSH.Constants.ID_ANCILE_HELP_PANEL_POPOUT_MODE_MENUITEM,
                text: ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.DropDown.PopoutModeMenuItem.Text),
                icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.DropDown.PopoutModeMenuItem.Icon),
                select: function() {
                    // Switch to popout mode
                    var oldMode = private.Mode;
                    // First, hide current help panel
                    private.hide();
                    // Then change mode
                    private.Mode = ANCILECSH.Constants.HELP_PANEL_MODE_POPOUT;
                    // Show help panel again
                    private.show(private.CurrentContext);
                    // Set mode back
                    private.Mode = oldMode;
                }
            });
            private.SapUi5SwitchModeDropDownMenu = new sap.ui.unified.Menu({
                id: ANCILECSH.Constants.ID_ANCILE_HELP_PANEL_SWITCHMODE_DROPDOWN_MENU,
                items: [
                    private.SapUi5DockModeMenuItem,
                    private.SapUi5FloatModeMenuItem,
                    private.SapUi5PopoutModeMenuItem
                ]
            });
        }
        var eDock = sap.ui.core.Popup.Dock;
        var isRTL = ANCILECSH.Utilities.isRTL();
        private.SapUi5DockModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isDock());
        private.SapUi5FloatModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isFloat());
        private.SapUi5PopoutModeMenuItem.setVisible(!ANCILECSH.HelpPanel.isPopout());
        private.SapUi5SwitchModeDropDownMenu.open(false, private.SapUi5SwitchModeButton, isRTL ? eDock.LeftTop : eDock.RightTop, isRTL ? eDock.LeftBottom : eDock.RightBottom, private.SapUi5SwitchModeButton);
	};
	
	private.createSapMPanel = function() {
		// Create HTML DOM element
		private.createHtmlDomHelpPanel();
		// Create sap.ui.core.HTML control to display help content
        private.SapUi5HtmlControl = new sap.ui.core.HTML();
        // Set default content
        //private.setHelpContent("");
        // Close button
        private.SapUi5CloseButton = new sap.m.Button({
            icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.CloseButton.Icon),
            press: private.hide
        });
        private.SapUi5CloseButton.setTooltip(ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.CloseButton.Text));
        // Switch mode button
        private.SapUi5SwitchModeButton = new sap.m.Button({
            icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.Icon),
            press: private.showSwitchModeDropDown
        }); 
        private.SapUi5SwitchModeButton.setTooltip(ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.Text));
        // Create Sap M Page
        var page = new sap.m.Page({
            title : ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.Title),
            showHeader: true,
            showFooter: false,
            showNavButton : false,
            navButtonType : sap.m.ButtonType.Back,
            enableScrolling : false,
            width : "100%",
            height : "100%",
            content : [
            	private.SapUi5HtmlControl
            ],
            headerContent: [
            	private.SapUi5SwitchModeButton,
            	private.SapUi5CloseButton
            ]//,
            //navButtonPress: function() { window.history.go(-1); }
        });
        page.placeAt(ANCILECSH.Constants.ID_ANCILE_HELP_PANEL, "only");
	};
	
	private.createSapUiCommonsPanel = function() {
		// Create HTML DOM element
		private.createHtmlDomHelpPanel();
		// Create sap.ui.core.HTML control to display help content
        private.SapUi5HtmlControl = new sap.ui.core.HTML();
        // Set default content
        //private.setHelpContent("");
        // Close button
        private.SapUi5CloseButton = new sap.ui.commons.Button({
			icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.CloseButton.Icon),
			press: private.hide
		});
		private.SapUi5CloseButton.setTooltip(ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.CloseButton.Text));
        // Switch mode button
        private.SapUi5SwitchModeButton = new sap.ui.commons.Button({
            icon: ANCILECSH.Utilities.getIcon(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.Icon),
            press: private.showSwitchModeDropDown
        }); 
        private.SapUi5SwitchModeButton.setTooltip(ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.SwitchModeButton.Text));
        // Create sap.ui.commons.Panel
        var panel = new sap.ui.commons.Panel({
        	showCollapseIcon : false,
        	title : new sap.ui.core.Title({
				text : ANCILECSH.Globalization.getText(ANCILECSH.Configuration.HelpPanel.Title)
			}),
        	width : "100%",
            height : "100%",
            content : [
            	private.SapUi5HtmlControl
            ],
            buttons : [
                private.SapUi5SwitchModeButton,
                private.SapUi5CloseButton
            ]
        });
        panel.placeAt(ANCILECSH.Constants.ID_ANCILE_HELP_PANEL, "only");
	};
	
	private.createAncileHelpPanel = function() {
		// Check Ui status
		if (ANCILECSH.Utilities.isUiReady()) {
			// Create Help panel when UI is ready
			// Recognize application
			var application = ANCILECSH.ApplicationRecognizer.recognizeApplication();
			if (application !== null) {
				if (application.IsSapM) {
					private.IsSapM = true;
					private.IsSapUiCommons = false;
					private.createSapMPanel();
				}
				else if (application.IsSapUiCommons) {
					private.IsSapM = false;
					private.IsSapUiCommons = true;
					private.createSapUiCommonsPanel();
				}
			}
			private.IsCreated = (private.HtmlDomHelpPanel !== null && private.HtmlDomHelpPanel !== undefined);
			if (private.IsCreated) {
				private.initializePositionAndSize();
			}
			return private.IsCreated;
		}
		else {
			ANCILECSH.Utilities.delayCall(private.createAncileHelpPanel, 100);
			return false;
		}
		return false;
	};
	
	public.getMode = function() {
        return private.Mode || ANCILECSH.Configuration.HelpPanel.Mode;
	};
	
	public.isFloat = function() {
        return (ANCILECSH.HelpPanel.getMode() === ANCILECSH.Constants.HELP_PANEL_MODE_FLOAT);
	};
	
	public.isDock = function() {
        return (ANCILECSH.HelpPanel.getMode() === ANCILECSH.Constants.HELP_PANEL_MODE_DOCK);
	};	
	
	public.isPopout = function() {
        return (ANCILECSH.HelpPanel.getMode() === ANCILECSH.Constants.HELP_PANEL_MODE_POPOUT);
	};	
	
	public.getWidth = function() {
		if (private.IsVisible) {
			return $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL).width();
		}
		return 0;
	};
	
	public.getHeight = function() {
		if (private.IsVisible) {
			return $("#" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL).height();
		}
		return 0;
	};
	
	public.isCreated = function() {
		return private.IsCreated;
	};
	
	public.isOpened = function() {
		return private.IsVisible;	
	};
	
	public.isOpenedAsPopup = function() {
        return (private.Popup && !private.Popup.closed);
	};
	
	public.isAppShifted = function() {
        return (private.AppShiftingStatus && private.AppShiftingStatus.length > 0);
	};
	
	public.show = function(context) {
		private.show(context);
	};
	
	public.hide = function() {
		private.hide();
	};
	
	public.create = function() {
		if (!private.IsCreated) {
			private.createAncileHelpPanel();
		}
	};
	
	public.delete = function() {
		$("*[id*='" + ANCILECSH.Constants.ID_ANCILE_HELP_PANEL + "']").remove();
		private.IsCreated = false;
		private.shiftApp(false);
	};
	
	public.init = function() {
        // Init sap.ui.unified for Menu and MenuItem classes
        // sap.ui.unified can be used by both sap.m and sap.ui.commons library
        sap.ui.getCore().loadLibrary("sap.ui.unified");
		// Init jqueryui
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-resizable");
		// Enable jQueryUI touch draggable, resizable
		ANCILECSH.Utilities.jQueryUiTouchable();
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.HelpPanel);
	};
	
})({});