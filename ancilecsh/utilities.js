// <copyright file="utilities.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Utilities class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.Utilities = ANCILECSH.Utilities || new (function(private, public) { 
	
	public = this;
	
	public.isRTL = function() {
		return sap.ui.getCore().getConfiguration().getRTL();
	};
	
	public.isMobile = function() {
		return sap.ui.getCore().isMobile();
	};
	
	public.isiOS = function() {
        return $("html[data-sap-ui-os*='iOS']").length > 0;
	};
	
	public.isUiReady = function() {
		return ((!sap.ui.getCore().getUIDirty()) && (document.readyState === "complete"));
	};
	
	public.isAncileHelpButtonExist = function(htmlDomElement) {
		if ($(htmlDomElement).find("*[id*='" + ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON + "']").length > 0) {
			return true;
		}
		return false;
	};
	
	public.isActionOnAncileHelpControls = function(target) {
        return ANCILECSH.Utilities.isActionOnAncileHelpButton(target) || ANCILECSH.Utilities.isActionOnAncileHelpPanel(target);
	};
	
	public.isActionOnAncileHelpButton = function(target) {
        var isActionOnAncileHelpButton = false;
        while (target !== null && target!== undefined) {
            if (target.id.indexOf(ANCILECSH.Constants.ID_ANCILE_HELP_BUTTON) >= 0) {
                isActionOnAncileHelpButton = true;
                break;
            }
            target = target.parentElement;
        }
        return isActionOnAncileHelpButton;
	};
	
	public.isActionOnAncileHelpPanel = function(target) {
        var isActionOnAncileHelpPanel = false;
        while (target !== null && target !== undefined) {
            if (target.id === ANCILECSH.Constants.ID_ANCILE_HELP_PANEL) {
                isActionOnAncileHelpPanel = true;
                break;
            }
            if (target.id === ANCILECSH.Constants.ID_ANCILE_HELP_PANEL_SWITCHMODE_DROPDOWN_MENU) {
                isActionOnAncileHelpPanel = true;
                break;
            }
            target = target.parentElement;
        }
        return isActionOnAncileHelpPanel;
	};
	
	public.getIcon = function(iconUrl) {
        if (iconUrl.indexOf("://") < 0) {
            return ANCILECSH.CurrentLocation + iconUrl;
        }
        else {
            return iconUrl;
        }
	};
	
	public.jQueryUiTouchable = function() {
        // Detect touch support
        $.support.touch = "ontouchend" in document;
        // Ignore browsers without touch support
        if (!$.support.touch) {
            return;
        }
        var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        _mouseDestroy = mouseProto._mouseDestroy,
        touchHandled;
        var simulateMouseEvent = function(event, simulatedType) {
            // Ignore multi-touch events
            if (event.originalEvent.touches.length > 1) {
                return;
            }
            event.preventDefault();
            var touch = event.originalEvent.changedTouches[0],
                simulatedEvent = document.createEvent("MouseEvents");
            // Initialize the simulated mouse event using the touch event's coordinates
            simulatedEvent.initMouseEvent(
                simulatedType,    // type
                true,             // bubbles                    
                true,             // cancelable                 
                window,           // view                       
                1,                // detail                     
                touch.screenX,    // screenX                    
                touch.screenY,    // screenY                    
                touch.clientX,    // clientX                    
                touch.clientY,    // clientY                    
                false,            // ctrlKey                    
                false,            // altKey                     
                false,            // shiftKey                   
                false,            // metaKey                    
                0,                // button                     
                null              // relatedTarget              
            );
            // Dispatch the simulated event to the target element
            event.target.dispatchEvent(simulatedEvent);
        };
        mouseProto._touchStart = function (event) {
            var self = this;
            // Ignore the event if another widget is already being handled
            if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
                return;
            }
            // Set the flag to prevent other widgets from inheriting the touch event
            touchHandled = true;
            // Track movement to determine if interaction was a click
            self._touchMoved = false;
            // Simulate the mouseover event
            simulateMouseEvent(event, "mouseover");
            // Simulate the mousemove event
            simulateMouseEvent(event, "mousemove");
            // Simulate the mousedown event
            simulateMouseEvent(event, "mousedown");
        };
        mouseProto._touchMove = function (event) {
            // Ignore event if not handled
            if (!touchHandled) {
                return;
            }
            // Interaction was not a click
            this._touchMoved = true;
            // Simulate the mousemove event
            simulateMouseEvent(event, "mousemove");
        };
        mouseProto._touchEnd = function (event) {
            // Ignore event if not handled
            if (!touchHandled) {
                return;
            }
            // Simulate the mouseup event
            simulateMouseEvent(event, "mouseup");
            // Simulate the mouseout event
            simulateMouseEvent(event, "mouseout");
            // If the touch interaction did not move, it should trigger a click
            if (!this._touchMoved) {
                // Simulate the click event
                simulateMouseEvent(event, "click");
            }
            // Unset the flag to allow other widgets to inherit the touch event
            touchHandled = false;
        };
        mouseProto._mouseInit = function () {
            var self = this;
            // Delegate the touch handlers to the widget's element
            self.element.bind({
                touchstart: $.proxy(self, "_touchStart"),
                touchmove: $.proxy(self, "_touchMove"),
                touchend: $.proxy(self, "_touchEnd")
            });
            // Call the original $.ui.mouse init method
            _mouseInit.call(self);
        };
        mouseProto._mouseDestroy = function () {
            var self = this;
            // Delegate the touch handlers to the widget's element
            self.element.unbind({
                touchstart: $.proxy(self, "_touchStart"),
                touchmove: $.proxy(self, "_touchMove"),
                touchend: $.proxy(self, "_touchEnd")
            });
            // Call the original $.ui.mouse destroy method
            _mouseDestroy.call(self);
        };
	};
	
	public.cssToNumber = function(cssSize) {
		var i = 0;
		if (cssSize) {
            if (cssSize.indexOf("px") > 0) {
                i = Number(cssSize.replace("px", ""));
            }
            else if (cssSize.indexOf("%") > 0) {
                i = Number(cssSize.replace("%", ""));
                i = Number(i) * 0.01;
            }
		}
		return i;
	};
	
	public.cssWidthToNumber = function(cssSize) {
        if (ANCILECSH.Utilities.isCssSizePercent(cssSize)) {
            return $(window).width() * ANCILECSH.Utilities.cssToNumber(cssSize);
        }
        else {
            return ANCILECSH.Utilities.cssToNumber(cssSize);
        }
	};
	
	public.cssHeightToNumber = function(cssSize) {
        if (ANCILECSH.Utilities.isCssSizePercent(cssSize)) {
            return $(window).height() * ANCILECSH.Utilities.cssToNumber(cssSize);
        }
        else {
            return ANCILECSH.Utilities.cssToNumber(cssSize);
        }
	};
	
	public.isCssSizePercent = function(cssSize) {
		if (cssSize.indexOf("%") > 0) {
			return true;
		}
		return false;
	};
	
	public.setUserData = function(key, value) {
		if (ANCILECSH.Utilities.isLocalStorageEnabled()) {
			ANCILECSH.Utilities.setLocalStorage(key, value);
		}
		else if (ANCILECSH.Utilities.isCookieEnabled()) {
			ANCILECSH.Utilities.setCookie(key, value, 365);
		}
	};
	
	public.getUserData = function(key) {
		if (ANCILECSH.Utilities.isLocalStorageEnabled()) {
			return ANCILECSH.Utilities.getLocalStorage(key);
		}
		else if (ANCILECSH.Utilities.isCookieEnabled()) {
			return ANCILECSH.Utilities.getCookie(key);
		}
		return "";
	};
	
	public.isLocalStorageEnabled = function() {
		if (window.localStorage) {
			return true;
		}
		return false;
	};
	
	public.isCookieEnabled = function() {
		if (navigator.cookieEnabled) {
			return true;
		}
		else {
			var oldCookie = document.cookie;
			document.cookie = "testcookie";
			var isCookieEnabled = (document.cookie.indexOf("testcookie") >= 0);
			document.cookie = oldCookie;
			return isCookieEnabled;
		}
	};
	
	public.setLocalStorage = function(key, value) {
		if (window.localStorage) {
			window.localStorage.setItem(key, value);
		}
	};
	
	public.getLocalStorage = function(key) {
		if (window.localStorage) {
			var value = window.localStorage.getItem(key);
			if (value) {
				return value;
			}
		}
		return "";
	};
	
	public.setCookie = function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	};
	
	public.getCookie = function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)=== " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	};
	
	public.delayCall = function(fn, time) {
		var t = setTimeout(function() {
			fn();
			clearTimeout(t);
		}, time);
	};
	
	public.callObjectMethod = function(obj, method, arg) {
		if (obj !== null && obj !== undefined) {
			if (method !== null && obj !== undefined) {
				if (obj[method.Name] !== null && obj[method.Name] !== undefined) {
					return obj[method.Name](arg);
				}
			}
		}
	};
	
	// If a function is called too frequently, this utilities can be used to just execute the last call
	public.throttle = function(fn, time) {
		var t = 0;
		return function() {
			var args = arguments,
				ctx = this;
				clearTimeout(t);
			t = setTimeout(function() {
				if (fn !== undefined) {
					fn.apply(ctx, args);
				}
			}, time );
		};
	};
	
	// Watch the change of an attribute of any object and raise an event upon value changed
	public.watch = function(object, attribute, onchanged) {
		var oldValue;
		if (typeof object[attribute] === "function") {
			oldValue = object[attribute]();
		}
		else {
			oldValue = object[attribute];
		}
		object["WatchTimer_" + attribute] = setInterval(function(){
			var newValue;
			if (typeof object[attribute] === "function") {
				newValue = object[attribute]();
			}
			else {
				newValue = object[attribute];
			}
			if (newValue !== oldValue) {
				if (onchanged) {
					onchanged(oldValue, newValue);
				}
				oldValue = newValue;
			}
		}, 10);
	};
	
	// Unwatch the change of an attribute of any object
	public.unwatch = function(object, attribute) {
		clearInterval(object["WatchTimer_" + attribute]);
	};
	
	public.init = function() {
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.Utilities);
	};

})({});