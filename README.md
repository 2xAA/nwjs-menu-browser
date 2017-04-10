# NWJS Menu Browser

Browser Polyfill for [NWJS](http://docs.nwjs.io/en/latest/) [Menu](http://docs.nwjs.io/en/latest/References/Menu/) and [MenuItem](http://docs.nwjs.io/en/latest/References/MenuItem/).

## Why

My audio visualisation app [modV](http://github.com/2xAA/modV/) recently moved to NWJS and I had previously built my own (terrible) context menus for the browser. So as not to write two lots of code I thought I'd polyfill the browser so you could use the same code between NWJS and (presumably) Chrome!

## Caveats

Does not support ```createMacBuiltIn```, ```MenuItem.key``` or ```MenuItem.modifiers```, though usage of these will not break existing code and will be displayed in the menu nodes.

These menus are not checked against any OS menu specification, but it's close enough to polyfill for the browser.
If you'd like more accurate functionality, PRs and enhancement issues are welcome!

## Usage

### Demo

Run ```npm run watch``` and a browser window pointing to ```localhost:8080``` will open.

### Build

Build using ```npm run build```, ```menu.js``` will be in ```./dist```.
*Coming to npm soon*

```HTML
<head>
  <link rel=stylesheet type=text/css href=nwjs-menu-browser.css>
</head>
<body>
  <script>
    if(!nw) {
      let nw = {};
      nw.Menu = require('nwjs-menu-browser').Menu;
      nw.MenuItem = require('nwjs-menu-browser').MenuItem;
    }
  </script>
</body>
```
## Screenshots
The included stylesheet (```nwjs-menu-browser.css```) is a close match to macOS Sierra's menus.
If somebody would like to contribute extra 'themes' I'd be very happy 😘

![menu-bar](./assets/images/menu-bar.png)

![menu-bar](./assets/images/context-menu.png)