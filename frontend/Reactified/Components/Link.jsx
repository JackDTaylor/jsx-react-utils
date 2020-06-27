export default () => {
	return ({target, children, ...props}) => <a onClick={target} {...props}>{children}</a>;
}