// <copyright file="Component.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ancilecsh/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ancilecsh.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			//-----------------------------------
			// Include ancilecsh
			$.sap.require("ancilecsh.ancilecsh");
			//-----------------------------------
		}
	});

});