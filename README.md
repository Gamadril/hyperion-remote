<img src='https://raw.githubusercontent.com/Gamadril/hyperion-remote/master/src/res/icon_128.png' width='40px' height='40px' /> Hyperion remote control
=======================

Hyperion remote control is a client side application for controlling the [hyperion server](https://github.com/tvdzwan/hyperion/wiki).
Currently there are 3 supported targets of the app:
- Chrome app (also available in Web Store: [hyperion remote control](https://chrome.google.com/webstore/detail/hyperion-remote-control/ohlgoegainndhjejojilnchmkoghjbpd))
- Cordova (currently only iOS 7.1 and higher, will come next into the app store)
- [Browser](http://gamadril.github.io/hyperion-remote) (client side app - needs latest hyperion server with WebSocket support)

Support further development with a small donation <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=D9QEDJHALXVBU" target="_blank"><img src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif"></a>

Planed:
- iOS release (need an apple developer account)
- Firefox OS support

Requirements
------------
node.js (build), grunt(build), Chrome 36, Cordova (for iOS), XCode (for iOS)

Build
------------
To build the iOS Version you need a Mac with installed XCode and cordova. 
Run "npm install" in the terminal from the root of the repository - this will install all necessary modules locally. "grunt" will then build the app.
In the generated out folder there will be separate folders for each platform with minified and optimized code. 

Development
------------
During development you normally work directly on the src folder and a browser as target platform.
If you need to test your code in a Chrome app or cordova, use grunt tasks "ios-test" and "chrome-test". They won't optimize and minify the source code so you can debug it.
Chrome app can be loaded in Chrome as "unpacked extension" for testing and debugging. To debug on iOS open the hyperion-remote.xcodeproj under out/cordova/platforms/ios/ and run it directly from XCode. Use Safari's remote debugger to connect to the app and debug JavaScript code.

Installation
------------
Current builds are available in Chrome Web Store and Apple's App Store (coming soon).


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

Cordova plugin org.chromium.socket
[License](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/LICENSE)

Inspired by the [Kuler Color Wheel](https://github.com/benknight/kuler-colorwheel-with-d3) reconstruction of Benjamin Knight 

App icon is kindly designed by [Fabian Ziegler/Team23](http://www.team23.de/)

License
-------
MIT license, see [LICENSE](./LICENSE)
