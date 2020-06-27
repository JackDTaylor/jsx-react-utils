import JsxReactUtils from "../../base/JsxReactUtils";
import PromiseRendererFn from "./Components/PromiseRenderer";

export default () => {
	const React = JsxReactUtils.dependency("react");
	const PromiseRenderer = JsxReactUtils.component('PromiseRenderer', PromiseRendererFn);

	const processedPrototypes = [];
	const processPromisePrototype = function(PromisePrototype) {
		if(processedPrototypes.has(PromisePrototype)) {
			return;
		}

		Object.defineProperty(PromisePrototype, '@@iterator', {
			enumerable: false,
			value: function*() {
				yield <___ key={this}>{this.toReact()}</___>;
			}
		});

		Object.defineProperty(PromisePrototype, 'toReact', {
			enumerable: false,
			value() {
				if(this.isFulfilled()) {
					return this.value();
				}

				return <PromiseRenderer promise={this} />;
			}
		});

		processedPrototypes.push(PromisePrototype);
	};

	processPromisePrototype(Promise.prototype);
	processPromisePrototype(Bluebird.prototype);
}