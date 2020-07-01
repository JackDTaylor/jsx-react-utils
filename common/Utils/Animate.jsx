export default () => {
	global.Animate = class Animate {
		static async Worker(step, onComplete = ()=>{}) {
			let stop = false;
			const stopper = () => stop = true;
			let timePassed = 0;

			while(timePassed < global.MAX_ANIMATION_TIME || 120000) {
				await step(timePassed, stopper);
				await delay(Time.deltaTime);

				timePassed += Time.deltaTime;

				if(stop) {
					break;
				}
			}

			await onComplete(timePassed);
			// console.log('Animation complete in ', timePassed, 'ms');
		}

		/**
		 *
		 * @param handler {{get,set,getTargetValue}|Array}
		 * @param targetValue
		 * @param time
		 * @param precision
		 * @param maxSpeed
		 * @return {Promise<void>}
		 * @constructor
		 */
		static async SmoothDamp(handler, targetValue, time = 500, precision = 0.01, maxSpeed = Infinity) {
			const sd = {};

			let get, set, getTargetValue;

			if(valueType(handler) == Array) {
				const [[object,reference]] = handler;

				get = ()  => object[reference];
				set = val => object[reference] = val;
				getTargetValue = () => targetValue;
			} else {
				get = handler.get;
				set = handler.set;
				getTargetValue = handler.getTargetValue || (() => targetValue);
			}

			const worker = (t, stopAnimation) => {
				set(Math.smoothDamp(get(), getTargetValue(), sd, time, maxSpeed));

				if(Math.abs(get() - getTargetValue()) < precision) {
					stopAnimation();
				}
			};

			const onComplete = () => {
				set(getTargetValue());
			};

			return Animate.Worker(worker, onComplete);
		}
	};
}