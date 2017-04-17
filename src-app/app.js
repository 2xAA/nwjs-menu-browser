import { Menu, MenuItem } from 'nwjs-browser-menu';

//const Menu = window.nwjsMenuBrowser.Menu;
//const MenuItem = window.nwjsMenuBrowser.MenuItem;

let images = ['pexels-photo-104948.jpeg', 'pexels-photo.jpeg', 'sky-earth-space-working.jpg', 'terminal.png'];
let currentImg = 0;

// preload images
images.forEach(i => {
	let img = new Image();
	img.src = 'example-assets/images/' + i;
	img.style.display = 'none';
	document.body.appendChild(img);
});

let m = new Menu();
m.append(new MenuItem({
	label: 'Log XMLHttpRequests'
}));

m.append(new MenuItem({
	icon: 'example-assets/images/terminal.png',
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

let changeWallItem = new MenuItem({
	label: 'Change Desktop Wallpaper'
});

changeWallItem.on('click', () => {
	currentImg++;
	if(currentImg > images.length-1) currentImg = 0;
	document.body.style.backgroundImage = 'url(example-assets/images/' + images[currentImg] + ')';
});

m.append(changeWallItem);

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

let menuBar = new Menu({
	type: 'menubar'
});

let menuBarSub = new Menu();
menuBarSub.append(new MenuItem({
	label: 'New Tab',
	key: 't',
	modifiers: 'cmd'
}));
menuBarSub.append(new MenuItem({
	label: 'New Window',
	key: 'n',
	modifiers: 'cmd'
}));
menuBarSub.append(new MenuItem({
	label: 'New Incognito Window',
	key: 'n',
	modifiers: 'cmd+shift'
}));
menuBarSub.append(new MenuItem({
	label: 'Re-open Closed Tab',
	key: 't',
	modifiers: 'cmd+shift'
}));
menuBarSub.append(new MenuItem({
	label: 'Open File…',
	key: 'o',
	modifiers: 'cmd'
}));
menuBarSub.append(new MenuItem({
	label: 'Open Location…',
	key: 'l',
	modifiers: 'cmd'
}));
menuBarSub.append(new MenuItem({
	type: 'separator'
}));
menuBarSub.append(new MenuItem({
	label: 'Close Window',
	key: 'w',
	modifiers: 'cmd+shift'
}));
menuBarSub.append(new MenuItem({
	label: 'Close Tab',
	key: 'w',
	modifiers: 'cmd'
}));
menuBarSub.append(new MenuItem({
	label: 'Save Page As…',
	key: 's',
	modifiers: 'cmd'
}));
menuBarSub.append(new MenuItem({
	type: 'separator'
}));
menuBarSub.append(new MenuItem({
	label: 'Email Page Location',
	key: 'i',
	modifiers: 'cmd+shift'
}));
menuBarSub.append(new MenuItem({
	type: 'separator'
}));
menuBarSub.append(new MenuItem({
	label: 'Print…',
	key: 'p',
	modifiers: 'cmd'
}));

menuBar.append(new MenuItem({
	label: 'File',
	submenu: menuBarSub
}));

let viewMenu = new Menu();

let affectedNode = new MenuItem({
	label: 'Always Show Bookmarks Bar',
	key: 'b',
	modifiers: 'cmd+shift',
	type: 'checkbox'
});

let actionNode = new MenuItem({
	label: 'Make above node disabled',
	key: 'f',
	modifiers: 'cmd+shift',
	type: 'checkbox',
	checked: true
});

actionNode.on('click', function() {
	affectedNode.enabled = !affectedNode.enabled;

	if(affectedNode.enabled) {
		this.label = 'Make above node disabled';
	} else {
		this.label = 'Make above node enabled';
	}
});

viewMenu.append(affectedNode);
viewMenu.append(actionNode);

viewMenu.append(new MenuItem({
	type: 'separator'
}));
viewMenu.append(new MenuItem({
	label: 'Stop',
	key: '.',
	modifiers: 'cmd',
	enabled: false
}));
viewMenu.append(new MenuItem({
	label: 'Reload This Page',
	key: 'r',
	modifiers: 'cmd'
}));
viewMenu.append(new MenuItem({
	type: 'separator'
}));
viewMenu.append(new MenuItem({
	label: 'Enter Full Screen',
	key: 'f',
	modifiers: 'cmd+ctrl'
}));
viewMenu.append(new MenuItem({
	label: 'Actual Size',
	key: '0',
	modifiers: 'cmd',
	enabled: false
}));
viewMenu.append(new MenuItem({
	label: 'Zoom In',
	key: '+',
	modifiers: 'cmd'
}));
viewMenu.append(new MenuItem({
	label: 'Zoom Out',
	key: '-',
	modifiers: 'cmd'
}));
viewMenu.append(new MenuItem({
	type: 'separator'
}));
viewMenu.append(new MenuItem({
	label: 'Cast…'
}));
viewMenu.append(new MenuItem({
	type: 'separator'
}));

let developerMenu = new Menu();
developerMenu.append(new MenuItem({
	label: 'View Source',
	key: 'u',
	modifiers: 'alt+cmd'
}));
developerMenu.append(new MenuItem({
	label: 'Developer Tools',
	key: 'i',
	modifiers: 'alt+cmd'
}));
developerMenu.append(new MenuItem({
	label: 'JavaScript Console',
	key: 'j',
	modifiers: 'alt+cmd'
}));

viewMenu.append(new MenuItem({
	label: 'Developer',
	submenu: developerMenu
}));

menuBar.append(new MenuItem({
	label: 'View',
	submenu: viewMenu
}));