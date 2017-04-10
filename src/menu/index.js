import MenuItem from '../menu-item';
import recursiveNodeFind from '../recursive-node-find';

class Menu {
	constructor(settings = {}) {
		const typeEnum = ['contextmenu', 'menubar'];
		let items = [];
		let type = isValidType(settings.type) ? settings.type : 'contextmenu';

		Object.defineProperty(this, 'items', {
			get: () => {
				return items;
			}
		});

	 	Object.defineProperty(this, 'type', {
			get: () => {
				return type;
			},
			set: (typeIn) => {
				type = isValidType(typeIn) ? typeIn : type;
			}
		});

		this.append = item => {
			if(!(item instanceof MenuItem)) {
				console.error('appended item must be an instance of MenuItem');
				return false;
			}
			item.parentMenu = this;
			let index = items.push(item);
			this.rebuild();
			return index;
		};

		this.insert = (item, index) => {
			if(!(item instanceof MenuItem)) {
				console.error('inserted item must be an instance of MenuItem');
				return false;
			}

			items.splice(index, 0, item);
			item.parentMenu = this;
			this.rebuild();
			return true;
		};

		this.remove = item => {
			if(!(item instanceof MenuItem)) {
				console.error('item to be removed is not an instance of MenuItem');
				return false;
			}

			let index = items.indexOf(item);
			if(index < 0) {
				console.error('item to be removed was not found in this.items');
				return false;
			} else {
				items.splice(index, 0);
				this.rebuild();
				return true;
			}
		};

		this.removeAt = index => {
			items.splice(index, 0);
			this.rebuild();
			return true;
		};

		this.node = null;
		this.clickHandler = this._clickHandle_hideMenu.bind(this);
		this.currentSubmenu = null;
		this.parentMenuItem = null;

		function isValidType(typeIn = '', debug = false) {
			if(typeEnum.indexOf(typeIn) < 0) {
				if(debug) console.error(`${typeIn} is not a valid type`);
				return false;
			}
			return true;
		}

		if(this.type === 'menubar') {
			document.addEventListener('click', this.clickHandler);
		}
	}

	_clickHandle_hideMenu(e) {
		if(!this.isNodeInChildMenuTree(e.target)) {
			if(this.node.classList.contains('show') || this.type === 'menubar') this.popdown();
		}
	}

	createMacBuiltin() {
		console.error('This method is not available in browser :(');
		return false;
	}

	popup(x, y, submenu = false, menubarSubmenu = false) {
		let menuNode;
		let setRight = false;

		submenu = submenu || this.submenu;
		this.submenu = menubarSubmenu;

		menubarSubmenu = menubarSubmenu || this.menubarSubmenu;
		this.menubarSubmenu = menubarSubmenu;

		if(this.node) {
			menuNode = this.node;
		} else {
			menuNode = this.buildMenu(submenu, menubarSubmenu);
			this.node = menuNode;

		}

		this.items.forEach(item => {
			if(item.submenu) {
				item.node.classList.remove('submenu-active');
				item.submenu.popdown();
			}
		});

		let width = menuNode.clientWidth;
		let height = menuNode.clientHeight;

		if((x + width) > window.innerWidth) {
			setRight = true;
			if(submenu) {
				let node = this.parentMenu.node;
				x = node.offsetWidth + ((window.innerWidth - node.offsetLeft) - node.offsetWidth) - 2;
			} else {
				x = 0;
			}
		}

		if((y + height) > window.innerHeight) {
			y = window.innerHeight - height;
		}

		if(!setRight) {
			menuNode.style.left = x + 'px';
			menuNode.style.right = 'auto';
		} else {
			menuNode.style.right = x + 'px';
			menuNode.style.left = 'auto';
		}

		menuNode.style.top = y + 'px';
		menuNode.classList.add('show');

		if(!submenu) document.addEventListener('click', this.clickHandler);

		if(this.node) {
			if(this.node.parentNode) {
				if(menuNode === this.node) return;
				this.node.parentNode.replaceChild(menuNode, this.node);
			} else {
				document.body.appendChild(this.node);
			}
		} else {
			document.body.appendChild(menuNode);
		}
	}

	popdown() {
		if(this.node) this.node.classList.remove('show');
		if(this.type !== 'menubar') document.removeEventListener('click', this.clickHandler);

		if(this.type === 'menubar') {
			this.clearActiveSubmenuStyling();
		}

		this.items.forEach(item => {
			if(item.submenu) {
				item.submenu.popdown();
			}
		});
	}

	popdownAll() {
		this.topmostMenu.popdown();
		return;
	}

	buildMenu(submenu = false, menubarSubmenu = false) {
		let menuNode = this.menuNode;
		if(submenu) menuNode.classList.add('submenu');
		if(menubarSubmenu) menuNode.classList.add('menubar-submenu');

		this.items.forEach(item => {
			let itemNode;
			if(this.type === 'menubar') itemNode = item.buildItem(true);
			else itemNode = item.buildItem();
			menuNode.appendChild(itemNode);
		});
		return menuNode;
	}

	rebuild() {
		if(!this.node && this.type !== 'menubar') return;
		let newNode;

		if(this.type === 'menubar') {
			newNode = this.buildMenu();
		} else {
			newNode = this.buildMenu(this.submenu, this.menubarSubmenu);
		}

		if(this.node) {
			if(this.node.parentNode) this.node.parentNode.replaceChild(newNode, this.node);
		} else {
			document.body.appendChild(newNode);
		}

		this.node = newNode;
	}

	get menuNode() {
		let node = document.createElement('ul');
		node.classList.add('nwjs-menu', this.type);
		return node;
	}

	get parentMenu() {
		if(this.parentMenuItem) {
			return this.parentMenuItem.parentMenu;
		} else {
			return undefined;
		}
	}

	get hasActiveSubmenu() {
		if(this.node.querySelector('.submenu-active')) {
			return true;
		} else {
			return false;
		}
	}

	get topmostMenu() {
		let menu = this;

		while(menu.parentMenu) {
			if(menu.parentMenu) {
				menu = menu.parentMenu;
			}
		}

		return menu;
	}

	clearActiveSubmenuStyling(notThisNode) {
		let submenuActive = this.node.querySelectorAll('.submenu-active');
		for(let node of submenuActive) {
			if(node === notThisNode) continue;
			node.classList.remove('submenu-active');
		}
	}

	isNodeInChildMenuTree(node = false) {
		if(!node) return false;
		return recursiveNodeFind(this, node);
	}
}

export default Menu;