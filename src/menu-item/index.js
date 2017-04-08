import Menu from '../menu';
import isDescendant from '../is-decendant';

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

		this.enabled = settings.enabled;
		if(typeof settings.enabled === 'undefined') this.enabled = true;

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

	_clickHandle_click() {
		console.log(Boolean(this.submenu));

		if(!this.enabled || this.submenu) return;
		this.parentMenu.popdownAll();
		if(this.click) this.click();
	}

	buildItem() {
		let node = document.createElement('li');
		node.classList.add('menu-item', this.type);

		node.addEventListener('click', this._clickHandle_click.bind(this));
		node.addEventListener('mouseup', (e) => {
			if(e.button === 2) this._clickHandle_click();
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
				if(node !== e.target) {
					if(!isDescendant(node, e.target)) this.submenu.popdown();
				}
				node.classList.add('submenu-active');
			});
		}

		if(!this.enabled) {
			node.classList.add('disabled');
		}

		node.addEventListener('mouseover', (e) => {
			if(this.submenu) {
				if(this.submenu.node) {
					if(this.submenu.node.classList.contains('show')) {
						return;
					}
				}

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

export default MenuItem;