import JsxReactUtils from "../base/JsxReactUtils";

export default () => {
	const Bluebird = JsxReactUtils.dependency("bluebird");

	global.Bluebird = Bluebird || global.Promise;
	global.Promise = global.Bluebird;

	if(Bluebird?.config) {
		JsxReactUtils.isBluebirdAvailable = true;

		Bluebird.config({
			cancellation: true,
			warnings: false,
			longStackTraces: false,
			monitoring: false
		});
	} else {
		JsxReactUtils.isBluebirdAvailable = false;

		if(JsxReactUtils.config('log.dependencyWarnings')) {
			console.warn('JsxReactUtils.Async was unable to resolve "bluebird" dependency, vanilla `Promise` was used.');
		}
	}

	global.delay = function delay(timeout = 0) {
		if(valueType(timeout) == Function) {
			// noinspection JSCheckFunctionSignatures
			return setTimeout(timeout, 0);
		}

		return new Bluebird(function(resolve, reject, onCancel) {
			let id = setTimeout(() => {
				try {
					resolve();
				} catch(e) {
					reject(e);
				}
			}, timeout);

			onCancel && onCancel(() => clearTimeout(id));
		});
	};

	global.promise = function promise(handler) {
		return new Bluebird(handler);
	};

	global.condition = function condition(callback, tickTime = 25) {
		let timePassed = 0;

		return new Bluebird(function(resolve, reject) {
			let intervalId = setInterval(() => safeResolve(() => {
				timePassed += tickTime;

				let value = callback(timePassed);

				if(value) {
					clearInterval(intervalId);
					safeResolve(resolve, reject, value);
				}
			}, reject), tickTime);
		});
	};

	global.safeResolve = function safeResolve(resolve, reject, ...resolveArgs) {
		try {
			return resolve(...resolveArgs);
		} catch(error) {
			return reject(error);
		}
	};

	global.awaitImmediate = function awaitImmediate(val, resolver) {
		if(isBluebirdPromise(val) && val.isFulfilled()) {
			resolver(val.value());
			return true;
		}

		if(isPromise(val) == false) {
			resolver(val);
			return true;
		}

		// Either a regular promise or not resolved Bluebird
		val.then(resolver);
		return false;
	};
}