<img src='https://raw.githubusercontent.com/Gamadril/hyperion-remote/master/src/res/icon_128.png' width='40px' height='40px' /> Hyperion remote control
=======================

Hyperion remote control is a client side application for controlling the [hyperion server](https://github.com/tvdzwan/hyperion/wiki).
Currently there are 4 supported targets of the app:
- Chrome app (also available in Web Store: [hyperion remote control](https://chrome.google.com/webstore/detail/hyperion-remote-control/ohlgoegainndhjejojilnchmkoghjbpd))
- iOS as WebApp that can be "installed" on the HOME screen
- [Firefox OS](http://gamadril.github.io/hyperion-remote) hosted app with the posibility to install locally.
- [Browser](http://gamadril.github.io/hyperion-remote)

Requirements
------------
node.js (build), grunt(build), Chrome 36
Since WebSocket support was added to hyperion some time ago it is not necessary to use plugins for TCP socket access any more. If you have problems with connection (especially on IE 11) try out the hyperion-poco branch.

Build
------------
Run "npm install" in the terminal from the root of the repository - this will install all necessary modules locally. "PATH=$(npm bin):$PATH grunt" will then build the app.
In the generated out folder there will be separate folders for each platform with minified and optimized code. 

Development
------------
During development you normally work directly on the src folder and a browser as target platform.
If you need to test your code in a Chrome app, use grunt task "chrome-test". They won't optimize and minify the source code so you can debug it.
Chrome app can be loaded in Chrome as "unpacked extension" for testing and debugging.

Installation
------------
Current builds are available in Chrome Web Store. You can also just open http://gamadril.github.io/hyperion-remote in your browser and use it. Server settings will be saved on your device, you don't have to enter them each time.

3rd party components
--------------------
Font Icons:
[Font Awesome](https://github.com/FortAwesome/Font-Awesome) by [Dave Gandy](http://fontawesome.io) is licensed under [SIL OFL 1.1](http://scripts.sil.org/OFL)

RequireJS:
[License](https://github.com/jrburke/requirejs/blob/master/LICENSE)

Stapes.js:
[License](https://github.com/hay/stapes/blob/master/LICENSE.txt)

Tinycolor:
[License](https://github.com/bgrins/TinyColor/blob/master/LICENSE)

Inspired by the [Kuler Color Wheel](https://github.com/benknight/kuler-colorwheel-with-d3) reconstruction of Benjamin Knight 

App icon is kindly designed by [Fabian Ziegler/Team23](http://www.team23.de/)

License
-------
MIT license, see [LICENSE](./LICENSE)
