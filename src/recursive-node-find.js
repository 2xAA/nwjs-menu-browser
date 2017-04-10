import isDescendant from './is-decendant';

export default function recursiveNodeFind(menu, node) {
	if(menu.node === node) {
		return true;
	} else if(isDescendant(menu.node, node)) {
		return true;
	} else if(menu.items.length > 0) {
		for(var i=0; i < menu.items.length; i++) {
			let menuItem = menu.items[i];
			if(!menuItem.node) continue;

			if(menuItem.node === node) {
				return true;
			} else if(isDescendant(menuItem.node, node)) {
				return true;
			} else {
				if(menuItem.submenu) {
					if(recursiveNodeFind(menuItem.submenu, node)) {
						return true;
					} else {
						continue;
					}
				}
			}
		}
	} else {
		return false;
	}

	return false;
}