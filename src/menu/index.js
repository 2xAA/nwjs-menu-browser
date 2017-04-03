const MenuItem = require('../menu');
const isDescendant = require('../is-decendant');

module.exports = class Menu {
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
			return items.push(item);
		};

		this.insert = (item, index) => {
			if(!(item instanceof MenuItem)) {
				console.error('inserted item must be an instance of MenuItem');
				return false;
			}

			items.splice(index, 0, item);
			item.parentMenu = this;
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
				return true;
			}
		};

		this.removeAt = index => {
			items.splice(index, 0);
			return true;
		};

		this.node = null;
		this.clickHandler = this._clickHandle_hideMenu.bind(this);
		this.currentSubmenuNode = null;
		this.parentMenuItem = null;

		function isValidType(typeIn = '', debug = false) {
			if(typeEnum.indexOf(typeIn) < 0) {
				if(debug) console.error(`${typeIn} is not a valid type`);
				return false;
			}
			return true;
		}
	}

	_clickHandle_hideMenu(e) {
		if(e.target !== this.node && !isDescendant(this.node, e.target)) {
			this.node.classList.remove('show');
		}
	}

	createMacBuiltin() {
		console.error('This method is not available in browser :(');
		return false;
	}

	popup(x, y, submenu = false) {
		let menuNode;

		if(this.node) {
			menuNode = this.node;
		} else {
			menuNode = this.buildMenu(submenu);
			this.node = menuNode;
			document.body.appendChild(menuNode);
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
			x = window.innerWidth - width;
		}

		if((y + height) > window.innerHeight) {
			y = window.innerHeight - height;
		}

		menuNode.style.left = x + 'px';
		menuNode.style.top = y + 'px';
		menuNode.classList.add('show');

		document.addEventListener('click', this.clickHandler);
	}

	popdown() {
		if(this.node) this.node.classList.remove('show');

		this.items.forEach(item => {
			if(item.submenu) {
				item.node.classList.remove('submenu-active');
				item.submenu.popdown();
			}
		});
	}

	buildMenu(submenu = false) {
		let menuNode = this.menuNode;
		if(submenu) menuNode.classList.add('submenu');

		this.items.forEach(item => {
			let itemNode = item.buildItem();
			// if(item.submenu) {
			// 	let submenuNode = item.submenu.buildMenu(true);
			// }
			menuNode.appendChild(itemNode);
		});

		return menuNode;
	}

	get menuNode() {
		let node = document.createElement('ul');
		node.classList.add(this.type);
		return node;
	}
};