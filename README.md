# jsx-react-utils

**JSX/React Utils** is a library that overhauls a lot of things in JS and React.

### Installation
Install library from NPM using following command:

```npm install jsx-react-utils --save```

### Usage
#### Important note!

You should not import anything that requires this library in definition (e.g. classes extending `ReactComponent`), since `jsx-react-utils` does not define anything until you call its initializer function. This may lead to `ReferenceError: ReactComponent is not defined`, which means that you're trying to use `jsx-react-utils` before it has been initialized.

The easiest way so solve this is to place `jsx-react-utils` imports and initialization into a separate file and include it before your component imports. See example below:

**jsx-react-utils.jsx**:
```js
import jsxReactUtils from "jsx-react-utils";

jsxReactUtils(['common', 'frontend'], {
	dependencies: {/* dependencies (see below) */}
});
```

**your-entry-point.jsx**:
```js
import "./jsx-react-utils";

import "./Components/MyComponent";
import "./Components/MyOtherComponent";

// Your app initialization and ReactDOM.render()
// ...
```

### Dependencies 
You have to provide default exports from the dependent packages. You should import them manually in any way you want,
e.g. separate `vendor.min.js` file, direct imports like in example below or from your favorite CDN via `<script>` tags.

**jsx-react-utils.jsx**:
```js
import React from "react";
import Bluebird from "bluebird";
import jQuery from "jquery";
import querystring from "querystring";
import fileSaver from "file-saver";

import jsxReactUtils from "jsx-react-utils";

jsxReactUtils(['common', 'frontend'], {
	dependencies: {
		"react":       React,
		"bluebird":    Bluebird,
		"jquery":      jQuery,
		"querystring": querystring,
		"file-saver":  fileSaver,
	}
});
```

You can pass `null` or an empty/non-empty object if you don't plan on using corresponding features. 

Features which require particular packages are described below:
- **react**       &ndash; Essential dependency for `frontend` module. You can omit this dependency if you use `common` module only.
- **bluebird**    &ndash; Essential for any async functionality both in `common` and `frontend` modules. If omitted, vanilla `Promise` will be used.
- **jquery**      &ndash; Required only for `URL.fetch` and `URL.fetchRaw` functions.
- **querystring** &ndash; Required only for `URL.build` and `URL.parseQuery` functions.
- **file-saver**  &ndash; Required only for `FileModel.download` method. You may pass your own function of the same signature.

### Modules
#### common
This module can be used both in backend and frontend environment.

#### frontend
This module is supposed to be used in frontend environment, but you can use it on backend as well (e.g. in universal/isomorphic application), just make sure to pass React dependency.

### Configuration
There are few configuration options available at the moment:

- **`cssNamespace`**`{String}` ReactComponent's CSS classes prefix 
- **`dependencies`**`{Object}` Dependencies, key is the package name, value is it's default export
- **`log`**`{Object}`          Allows you to configure some components' log level 

### Documentation
Sadly, no documentation yet :c
