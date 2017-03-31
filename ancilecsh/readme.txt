<copyright file="readme.txt" company="Ancile Solutions Inc.">
   Copyright © 2016 ANCILE Solutions, Inc.
 </copyright>

How to deploy:

1. ANCILECSH package is copied into UI5 app's project:

	<project_name>
	|______	webapp
		|______	ancilecsh
		|	|______	ancilecsh.js
		|	controller
		|	|______	View1.controller.js
		|______	view
		|	|______	View1.view.xml
		|______	Component.js
		|______	index.html

1.1. Modify 'index.html' file:

	<!-- Include ancilecsh.js -->
	<script src="{relative_path}/ancilecsh/ancilecsh.js"></script>

1.2. Modify 'Component.js' file:
	
	// Include ancilecsh.js
	$.sap.require(this.getManifestEntry("sap.app").id + ".ancilecsh.ancilecsh");

1.3. Modify any 'controller.js' file:

	// Include ancilecsh.js
	$.sap.require(this.getOwnerComponent().getManifestEntry("sap.app").id + ".ancilecsh.ancilecsh");
	

2. ANCILECSH package is copied to SAPUI5 resource folder:

	resource
	|______	ancilecsh
	|	|______	ancilecsh.js
	|______	sap-ui-core.js
	
	<project_name>
	|______	webapp
		|______	controller
		|	|______	View1.controller.js
		|______	view
		|	|______	View1.view.xml
		|______	Component.js
		|______	index.html		
	

2.1. Modify 'index.html' file:

	<!-- Include ancilecsh.js -->
	<script src="{path_to_ui5_resource_folder}resource/ancilecsh/ancilecsh.js"></script>

2.2. Modify 'Component.js' file:

	// Include ancilecsh.js
	$.sap.require("ancilecsh.ancilecsh");

2.3. Modify any 'controller.js' file:

	// Include ancilecsh.js
	$.sap.require("ancilecsh.ancilecsh");


3. ANCILECSH package is hosted public over internet:

3.1. Modify 'index.html' file:
	
	<!-- Include ancilecsh.js -->
	<script src="https://{server}/ancilecsh/ancilecsh.js"></script>
	
3.2. Modify 'Component.js' file:
	
	// Include ancilecsh.js
	$.sap.registerModulePath("ancilecsh", "https://{server}/ancilecsh");
	$.sap.require("ancilecsh.ancilecsh");

3.3. Modify any 'controller.js' file:

	// Include ancilecsh.js
	$.sap.registerModulePath("ancilecsh", "https://{server}/ancilecsh");
	$.sap.require("ancilecsh.ancilecsh");
	
