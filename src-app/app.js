import { Menu, MenuItem } from 'nwjs-browser-menu';

let m = new Menu();
m.append(new MenuItem({
	label: 'Log XMLHttpRequests'
}));

m.append(new MenuItem({
	icon: 'terminal.png',
	label: 'Clear console',
	modifiers: 'cmd+shift+alt',
	key: 'D',
	tooltip: 'This MenuItem actually does nothing!'
}));

m.append(new MenuItem({
	label: 'Clear console history'
}));

m.append(new MenuItem({
	label: 'Save as...',
	enabled: false
}));

m.append(new MenuItem({
	label: 'Show bookmarks bar',
	type: 'checkbox',
	click: function() {
		console.log(`Checked: ${this.checked}`);
	}
}));

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
	label: 'Filter',
	submenu: sm
});

m.insert(mi, 1);

let mi4 = new MenuItem({
	type: 'separator'
});

m.insert(mi4, 2);

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

sm.insert(mi2, 1);

let mi3 = new MenuItem({
	type: 'separator'
});

sm.insert(mi3, 2);

console.log(m, sm, sm2);

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	m.popup(e.clientX, e.clientY);
	return false;
});

window.Menu = Menu;
window.MenuItem = MenuItem;
window.m = m;