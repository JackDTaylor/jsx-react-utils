import Validator from "./Validator";

export default class MaxLengthValidator extends Validator {
	maxLength;

	constructor(maxLength) {
		super();
		this.maxLength = maxLength;
	}

	validate(value) {
		return `${value}`.length <= this.maxLength;
	}

	message() {
		return `Превышена максимально допустимая длина в ${'символ'.plural(this.maxLength)}`;
	}
}