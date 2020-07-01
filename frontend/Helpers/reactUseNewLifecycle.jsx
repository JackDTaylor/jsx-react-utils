const reactVersion = React => React.version.split('.').map(x => parseInt(x));

const reactUseNewLifecycle = ([major, minor]) => {
	return major > 16 || (major == 16 && minor >= 9)
};

export default React => reactUseNewLifecycle(reactVersion(React));