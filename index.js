//jshint esnext:true

function isDescendant(parent, child) {
	var node = child.parentNode;
	while(node !== null) {
		if(node == parent) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

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
			if(item.submenu) {
				let submenuNode = item.submenu.buildMenu(true);
			}
			menuNode.appendChild(itemNode);
		});

		return menuNode;
	}

	get menuNode() {
		let node = document.createElement('ul');
		node.classList.add(this.type);
		return node;
	}
}

class MenuItem {
	constructor(settings = {}) {
		const modifiersEnum = ['cmd', 'command', 'super', 'shift', 'ctrl', 'alt'];
		const typeEnum = ['separator', 'checkbox', 'normal'];
		let type = isValidType(settings.type) ? settings.type : 'normal';
		let submenu = settings.submenu || null;
		let click = settings.click || null;
		let modifiers = validModifiers(settings.modifiers) ? settings.modifiers : null;

		if(submenu) {
			submenu.parentMenuItem = this;
		}

		Object.defineProperty(this, 'type', {
			get: () => {
				return type;
			}
		});

		Object.defineProperty(this, 'submenu', {
			get: () => {
				return submenu;
			},
			set: (inputMenu) => {
				console.warn('submenu should be set on initialisation, changing this at runtime could be slow on some platforms.');
				if(!(inputMenu instanceof Menu)) {
					console.error('submenu must be an instance of Menu');
					return;
				} else {
					submenu = inputMenu;
					submenu.parentMenuItem = this;
				}
			}
		});

		Object.defineProperty(this, 'click', {
			get: () => {
				return click;
			},
			set: (inputCallback) => {
				if(typeof inputCallback !== 'function') {
					console.error('click must be a function');
					return;
				} else {
					click = inputCallback;
				}
			}
		});

		Object.defineProperty(this, 'modifiers', {
			get: () => {
				return modifiers;
			},
			set: (inputModifiers) => {
				modifiers = validModifiers(inputModifiers) ? inputModifiers : modifiers;
			}
		});

		this.label = settings.label || '';
		this.icon = settings.icon || null;
		this.iconIsTemplate = settings.iconIsTemplate || false;
		this.tooltip = settings.tooltip || '';
		this.checked = settings.checked || false;
		this.enabled = settings.enabled || true;
		this.key = settings.key || null;
		this.node = null;

		function validModifiers(modifiersIn = '') {
			let modsArr = modifiersIn.split('+');
			for(let i=0; i < modsArr; i++) {
				let mod = modsArr[i].trim();
				if(modifiersEnum.indexOf(mod) < 0) {
					console.error(`${mod} is not a valid modifier`);
					return false;
				}
			}
			return true;
		}

		function isValidType(typeIn = '', debug = false) {
			if(typeEnum.indexOf(typeIn) < 0) {
				if(debug) console.error(`${typeIn} is not a valid type`);
				return false;
			}
			return true;
		}
	}

	buildItem() {
		let node = document.createElement('li');
		node.classList.add('menu-item', this.type);

		node.addEventListener('click', () => {
			document.removeEventListener('click', this.parentMenu.clickHandler);
			this.parentMenu.popdown();
			if(this.click) this.click();
		});

		let iconWrapNode = document.createElement('div');
		iconWrapNode.classList.add('icon-wrap');

		if(this.icon) {
			let iconNode = new Image();
			iconNode.src = this.icon;
			iconNode.classList.add('icon');
			iconWrapNode.appendChild(iconNode);
		}

		let labelNode = document.createElement('div');
		labelNode.classList.add('label');
		labelNode.textContent = this.label;

		let modifierNode = document.createElement('div');
		modifierNode.classList.add('modifiers');
		modifierNode.textContent = this.modifiers;

		if(this.submenu) {
			modifierNode.textContent = '▶︎';

			node.addEventListener('mouseout', (e) => {
				if(!isDescendant(node, e.target)) this.submenu.popdown();

				node.classList.add('submenu-active');
			});
		}

		node.addEventListener('mouseover', (e) => {
			if(this.submenu) {
				let parentNode = node.parentNode;

				let x = parentNode.offsetWidth + parentNode.offsetLeft - 2;
				let y = parentNode.offsetTop + node.offsetHeight;
				this.submenu.popup(x, y, true);
				this.parentMenu.currentSubmenu = this.submenu;
			} else {
				if(this.parentMenu.currentSubmenu) {
					this.parentMenu.currentSubmenu.popdown();
					this.parentMenu.currentSubmenu.parentMenuItem.node.classList.remove('submenu-active');
					this.parentMenu.currentSubmenu = null;
				}
			}
		});

		node.appendChild(iconWrapNode);
		node.appendChild(labelNode);
		node.appendChild(modifierNode);

		this.node = node;
		return node;
	}
}

let m = new Menu();
for(let i=0; i < 10; i++) {
	let mi = new MenuItem({
		label: 'Item ' + i
	});
	m.append(mi);
}

let sm = new Menu();
for(let i=10; i < 20; i++) {
	let mi = new MenuItem({
		label: 'Item ' + i,
		click: function() { //jshint ignore:line
			alert('hello m8 - ' + i);
		}
	});
	sm.append(mi);
}

let mi = new MenuItem({
	label: 'Item with sub',
	submenu: sm
});

m.insert(mi, 1);

let sm2 = new Menu();
for(let i=20; i < 30; i++) {
	let mi = new MenuItem({
		label: 'Item ' + i
	});
	sm2.append(mi);
}

let mi2 = new MenuItem({
	label: 'Item with sub 2',
	submenu: sm2
});

let mi3 = new MenuItem({
	type: 'separator'
});

sm.insert(mi2, 1);
sm.insert(mi3, 2);

console.log(m, sm, sm2);

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	m.popup(e.clientX, e.clientY);
	return false;
});