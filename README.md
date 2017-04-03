# NWJS Menu Browser

Browser Polyfill for [NWJS](http://docs.nwjs.io/en/latest/) [Menu](http://docs.nwjs.io/en/latest/References/Menu/) and [MenuItem](http://docs.nwjs.io/en/latest/References/MenuItem/).

Usage:

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

Currently this only supports the ```'context'``` Menu type.