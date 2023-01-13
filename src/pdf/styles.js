export function pageStyle( { alwaysOnSidebar, isLeftHanded } ) {
	return {
		flex: 1,
		width: '100%',
		height: '100%',
		flexGrow: 1,
		flexDirection: 'column',
		paddingLeft: alwaysOnSidebar && ! isLeftHanded ? 31 : 0,
		paddingRight: alwaysOnSidebar && isLeftHanded ? 31 : 0,
	};
}

export const content = {
	flexGrow: 1,
};
