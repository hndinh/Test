// <copyright file="constants.js" company="Ancile Solutions Inc.">
//   Copyright © 2016 ANCILE Solutions, Inc.
// </copyright>

//
// ANCILECSH Monitoring class
//
var ANCILECSH = ANCILECSH;
ANCILECSH.Constants = ANCILECSH.Constants || new (function(private, public) { 
	
	public = this;
	
	public.ID_ANCILE_HELP = "ancile-help";
	
	public.ID_ANCILE_HELP_BUTTON = "ancile-help-button";
	
	public.ID_ANCILE_HELP_PANEL = "ancile-help-panel";
	
	public.ID_ANCILE_HELP_PANEL_SWITCHMODE_DROPDOWN_MENU = "ancile-help-panel-switchmode-dropdown-menu";
	
	public.ID_ANCILE_HELP_PANEL_DOCK_MODE_MENUITEM = "ancile-help-panel-dock-mode-menuitem";
	
	public.ID_ANCILE_HELP_PANEL_FLOAT_MODE_MENUITEM = "ancile-help-panel-float-mode-menuitem";
	
	public.ID_ANCILE_HELP_PANEL_POPOUT_MODE_MENUITEM = "ancile-help-panel-popout-mode-menuitem";
	
	public.ID_ANCILE_HELP_CONTEXT_DATA = "ancile-help-context-data";
	
	public.ID_ANCILE_HELP_ACTED_CONTROL = "ancile-help-acted-control";
	
	public.ID_ANCILE_HELP_PRIMARY_CSH = "ancile-help-primary-csh";
	
	public.ID_ANCILE_HELP_SECONDARY_CSH = "ancile-help-secondary-csh";
	
	public.ID_ANCILE_HELP_TERTIARY_CSH = "ancile-help-tertiary-csh";
	
	public.ID_IOS_SCROLL_FRAME = "ios-scroll-frame";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE = "ui-resizable";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE_IFRAMEFIX = "ui-resizable-iframefix";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE_HANDLE = "ui-resizable-handle";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE_E = "ui-resizable-e";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE_W = "ui-resizable-w";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE_SE = "ui-resizable-se";
	
	public.CSS_CLASS_JQUERYUI_ICON = "ui-icon";
	
	public.CSS_CLASS_JQUERYUI_ICON_GRIPSMALL_DIAGONAL_SE = "ui-icon-gripsmall-diagonal-se";
	
	public.CSS_CLASS_JQUERYUI_RESIZABLE_HIDDEN_HANDLE = "ui-resizable-hidden-handle";
	
	public.HELP_BUTTON_MODE_FLOAT = "float";
	
	public.HELP_BUTTON_MODE_DOCK = "dock";
	
	public.HELP_BUTTON_DIRECTION_LEFT = "left";
	
	public.HELP_BUTTON_DIRECTION_RIGHT = "right";
	
	public.HELP_PANEL_MODE_FLOAT = "float";
	
	public.HELP_PANEL_MODE_DOCK = "dock";
	
	public.HELP_PANEL_MODE_POPOUT = "popout";
	
	public.USERDATA_ANCILE_HELP_BUTTON_LAST_DIRECTION = "ancilehelpbuttonlastdirection";
	
	public.USERDATA_ANCILE_HELP_BUTTON_LAST_TOP = "ancilehelpbuttonlasttop";
	
	public.USERDATA_ANCILE_HELP_PANEL_LAST_MODE = "ancilehelppanellastmode";
	
	public.USERDATA_ANCILE_HELP_PANEL_LAST_LEFT = "ancilehelppanellastleft";
	
	public.USERDATA_ANCILE_HELP_PANEL_LAST_TOP = "ancilehelppanellasttop";
	
	public.USERDATA_ANCILE_HELP_PANEL_LAST_WIDTH = "ancilehelppanellastwidth";
	
	public.USERDATA_ANCILE_HELP_PANEL_LAST_HEIGHT = "ancilehelppanellastheight";
	
	public.EVENT_NAME_HELP_PANEL_SHOW = "helppanelshow";
	
	public.EVENT_NAME_HELP_PANEL_HIDE = "helppanelhide";
	
	public.EVENT_NAME_HELP_PANEL_MODE_CHANGE = "helppanelmodechange";
	
	public.EVENT_NAME_HELP_PANEL_RESIZING = "helppanelresizing";
	
	public.EVENT_NAME_HELP_PANEL_RESIZED = "helppanelresized";
	
	public.EVENT_NAME_UI_CHANGE = "uichange";
	
	public.EVENT_NAME_ACTED_CONTROL_CHANGE = "actedcontrolchange";
	
	public.EVENT_NAME_ACTED_VIEW_CHANGE = "actedviewchange";
	
	public.EVENT_NAME_WINDOW_RESIZE = "resize";
	
	public.SEPARATOR_CONTEXT_DATA = "_";
	
	public.REGEX_STABLE_SAPUI5_ID = /__[A-Za-z]*[0-9]*--/g;
	
	public.REGEX_AUTO_GENERATED_SAPUI5_ID = /__[A-Za-z]*[0-9]*/g;
	
	public.init = function() {
		// Display initialized object in console
		ANCILECSH.Console.debug(ANCILECSH.Constants);
	};
	
})({});