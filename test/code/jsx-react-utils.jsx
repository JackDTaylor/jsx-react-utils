import jsxUtilsCommon from "../../common";
import jsxUtilsFrontend from "../../frontend";

import fileSaver from "file-saver";
import React from "react";
import Bluebird from "bluebird";
import jQuery from "jquery";
import querystring from "querystring";

(cfg => {
	jsxUtilsCommon(cfg);
	jsxUtilsFrontend(cfg);
})({
	"file-saver":  fileSaver,
	"react":       React,
	"bluebird":    Bluebird,
	"jquery":      jQuery,
	"querystring": querystring,
});
