import jsxReactUtils from "../../index";
import {React, Bluebird, jQuery, querystring, fileSaver} from "./vendor";

window.JRU = jsxReactUtils(['common', 'frontend'], {
	cssNamespace: 'jx',
	dependencies: {
		"file-saver":  fileSaver,
		"react":       React,
		"bluebird":    Bluebird,
		"jquery":      jQuery,
		"querystring": querystring,
	}
});