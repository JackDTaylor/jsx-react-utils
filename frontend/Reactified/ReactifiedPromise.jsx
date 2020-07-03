import JsxReactUtils from "../../base/JsxReactUtils";
import PromiseRendererFn from "./../Components/Reactified/PromiseRenderer";

export default () => {
	const React = JsxReactUtils.dependency("react");
	const Bluebird = JsxReactUtils.dependency("bluebird");

	const processedPrototypes = [];
	const processPromisePrototype = function(PromisePrototype) {
		if(!PromisePrototype) {
			return;
		}

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
				if(isBluebirdPromise(this) && this.isFulfilled()) {
					return this.value();
				}

				const PromiseRenderer = JsxReactUtils.component('PromiseRenderer', PromiseRendererFn);

				return <PromiseRenderer promise={this} />;
			}
		});

		processedPrototypes.push(PromisePrototype);
	};

	processPromisePrototype(Bluebird?.prototype);
	processPromisePrototype(global?.Promise?.prototype);
	processPromisePrototype(global?.Bluebird?.prototype);
}