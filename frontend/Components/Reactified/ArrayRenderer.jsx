import JsxReactUtils from "../../../base/JsxReactUtils";
import LinkFn from "./Link";

export default () => {
	const cssNamespace = JsxReactUtils.config('cssNamespace');

	return class ArrayRenderer extends React.Component {
		@prop limit = 2;
		@prop array;

		@prop allowExpand = false;
		@prop expandStep = 10;
		@prop expandToList = false;

		@state expanded = 0;

		separator(left) {
			if(left > 0) {
				return (left > 1) ? ', ' : ' и ';
			}

			return '';
		}

		get displayAsList() {
			return this.expandToList && this.expanded > 0;
		}

		renderExpandButton(overflow) {
			const Link = JsxReactUtils.component('Link', LinkFn);

			if(!overflow) {
				return '';
			}

			let text = this.displayAsList ? 'и ' : '';
			text += `еще ${overflow}`;

			if(this.allowExpand) {
				text = <Link dotted target={() => this.expanded += this.expandStep}>{text}</Link>;
			}

			if(!this.displayAsList) {
				return text;
			}

			return <div>{text}</div>;
		}

		render() {
			const array = this.array.slice(0, this.limit + this.expanded);
			const overflow = this.array.length - array.length;

			return (
				<___>
					{array.map((item, i) => this.displayAsList ? (
						<div className={`${cssNamespace} ${cssNamespace}-array-item`} key={i}>{item}</div>
					) : (
						<___ key={i}>
							{item}
							{this.separator(array.length - i - !overflow)}
						</___>
					))}

					{this.renderExpandButton(overflow)}
				</___>
			);
		}
	};
}