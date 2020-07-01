export default class Validator {
	/**
	 * @param value
	 */
	static Validate(value) {

	}

	get defaultParams() {
		return {};
	}

	validate() {
		throw new Error(`Валидатор ${this.constructor.name} не объявлен`);
	}

	message() {
		return 'Поле заполнено неправильно';
	}
}