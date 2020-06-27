import jsxReactUtils from "../../index";
import {React, Bluebird, jQuery, querystring, fileSaver} from "./vendor";

jsxReactUtils(['common', 'frontend'], {
	dependencies: {
		"file-saver":  fileSaver,
		"react":       React,
		"bluebird":    Bluebird,
		"jquery":      jQuery,
		"querystring": querystring,
	}
});