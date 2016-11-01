/*global chrome*/
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        'outerBounds': {
            width: 1100,
            height: 720,
            minWidth: 800,
            minHeight: 600,

        }
    });
});
// TODO: Check these settings
window.config = {
   "model_": "AppConfig",
   "id": 1,
   "appName": "Silvalexandre",
   "homepage": "http://silvalexandre.com",
   "enableNavBttns": false,
   "enableHomeBttn": false,
   "enableReloadBttn": false,
   "enableLogoutBttn": false,
   "kioskEnabled": true
};