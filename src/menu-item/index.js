import Menu from '../menu';
import isDescendant from '../is-decendant';
import { modifierSymbols, keySymbols } from '../symbols';
const EventEmitter2 = require('eventemitter2').EventEmitter2;


class MenuItem extends EventEmitter2 {
	constructor(settings = {}) {
		super();

		const modifiersEnum = ['cmd', 'command', 'super', 'shift', 'ctrl', 'alt'];
		const typeEnum = ['separator', 'checkbox', 'normal'];
		let type = isValidType(settings.type) ? settings.type : 'normal';
		let submenu = settings.submenu || null;
		let click = settings.click || null;
		let modifiers = validModifiers(settings.modifiers) ? settings.modifiers : null;
		let label = settings.label || '';

		let enabled = settings.enabled;
		if(typeof settings.enabled === 'undefined') enabled = true;

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
				this.rebuild();
			}
		});

		Object.defineProperty(this, 'enabled', {
			get: () => {
				return enabled;
			},
			set: (inputEnabled) => {
				enabled = inputEnabled;
				this.rebuild();
			}
		});

		Object.defineProperty(this, 'label', {
			get: () => {
				return label;
			},
			set: (inputLabel) => {
				label = inputLabel;
				this.rebuild();
			}
		});

		this.icon = settings.icon || null;
		this.iconIsTemplate = settings.iconIsTemplate || false;
		this.tooltip = settings.tooltip || '';
		this.checked = settings.checked || false;

		this.key = settings.key || null;
		this.node = null;

		if(this.key) {
			this.key = this.key.toUpperCase();
		}

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
		if(!this.enabled || this.submenu) return;

		this.parentMenu.popdownAll();
		if(this.type === 'checkbox') {
			this.node.classList.toggle('checked');
			this.checked = !this.checked;
		}

		this.emit('click', this);

		if(this.click) this.click();
	}

	_clickHandle_click_menubarTop() {
		this.node.classList.toggle('submenu-active');

		if(this.submenu) {
			if(this.node.classList.contains('submenu-active')) {
				this.submenu.popup(this.node.offsetLeft, this.node.clientHeight, true, true);
				this.parentMenu.currentSubmenu = this.submenu;
			} else {
				this.submenu.popdown();
				this.parentMenu.currentSubmenu = null;
			}
		}
	}

	_mouseoverHandle_menubarTop() {
		if(this.parentMenu.hasActiveSubmenu) {
			if(this.node.classList.contains('submenu-active')) return;

			this.parentMenu.clearActiveSubmenuStyling(this.node);
			this.node.classList.add('submenu-active');

			if(this.parentMenu.currentSubmenu) {
				this.parentMenu.currentSubmenu.popdown();
				this.parentMenu.currentSubmenu = null;
			}

			if(this.submenu) {
				this.submenu.popup(this.node.offsetLeft, this.node.clientHeight, true, true);
				this.parentMenu.currentSubmenu = this.submenu;
			}
		}
	}

	buildItem(menuBarTopLevel = false, rebuild = false) {
		let node = document.createElement('li');
		node.classList.add('menu-item', this.type);

		menuBarTopLevel = menuBarTopLevel || this.menuBarTopLevel || false;
		this.menuBarTopLevel = menuBarTopLevel;

		if(menuBarTopLevel) {
			node.addEventListener('mousedown', this._clickHandle_click_menubarTop.bind(this));
			node.addEventListener('mouseover', this._mouseoverHandle_menubarTop.bind(this));
		} else if(this.type !== 'separator') {
			node.addEventListener('click', this._clickHandle_click.bind(this));
			node.addEventListener('mouseup', (e) => {
				if(e.button === 2) this._clickHandle_click();
			});
		}

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

		let modifierNode = document.createElement('div');
		modifierNode.classList.add('modifiers');

		let checkmarkNode = document.createElement('div');
		checkmarkNode.classList.add('checkmark');

		if(this.checked && !menuBarTopLevel) {
			node.classList.add('checked');
		}

		let text = '';

		if(this.submenu && !menuBarTopLevel) {
			text = '▶︎';

			node.addEventListener('mouseout', (e) => {
				if(node !== e.target) {
					if(!isDescendant(node, e.target)) this.submenu.popdown();
				}
				node.classList.add('submenu-active');
			});
		}

		if(this.modifiers && !menuBarTopLevel) {
			let mods = this.modifiers.split('+');

			// Looping this way to keep order of symbols - required by macOS
			for(let symbol in modifierSymbols) {
				if(mods.indexOf(symbol) > -1) {
					text += modifierSymbols[symbol];
				}
			}
		}

		if(this.key && !menuBarTopLevel) {
			text += this.key;
		}

		if(!this.enabled) {
			node.classList.add('disabled');
		}

		if(!menuBarTopLevel) {
			node.addEventListener('mouseover', () => {
				if(this.submenu) {
					if(this.submenu.node) {
						if(this.submenu.node.classList.contains('show')) {
							return;
						}
					}

					let parentNode = node.parentNode;

					let x = parentNode.offsetWidth + parentNode.offsetLeft - 2;
					let y = parentNode.offsetTop + node.offsetTop - 4;
					this.submenu.popup(x, y, true, menuBarTopLevel);
					this.parentMenu.currentSubmenu = this.submenu;
				} else {
					if(this.parentMenu.currentSubmenu) {
						this.parentMenu.currentSubmenu.popdown();
						this.parentMenu.currentSubmenu.parentMenuItem.node.classList.remove('submenu-active');
						this.parentMenu.currentSubmenu = null;
					}
				}
			});
		}

		if(this.icon) labelNode.appendChild(iconWrapNode);

		let textLabelNode = document.createElement('span');
		textLabelNode.textContent = this.label;
		textLabelNode.classList.add('label-text');

		node.appendChild(checkmarkNode);

		labelNode.appendChild(textLabelNode);
		node.appendChild(labelNode);

		modifierNode.appendChild(document.createTextNode(text));
		node.appendChild(modifierNode);

		node.title = this.tooltip;
		if(!rebuild) this.node = node;
		return node;
	}

	rebuild() {
		if(!this.node && this.type !== 'separator') return;
		let newNode;

		newNode = this.buildItem(this.menuBarTopLevel, true);

		if(this.node) {
			if(this.node.parentNode) this.node.parentNode.replaceChild(newNode, this.node);
		}

		this.node = newNode;
	}
}

export default MenuItem;