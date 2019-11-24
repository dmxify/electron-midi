const {
  app,
  BrowserWindow
} = require('electron')


let winTest; // global reference to test BrowserWindow


app.on('ready', () => {
  winTest = new BrowserWindow({
    name: 'electron-midi test',
    x: 100,
    y: 100,
    width: 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  });
  winTest.loadFile('renderer.html');
  winTest.webContents.on('did-finish-load', e => {
    winTest.show();
  });

  winTest.webContents.openDevTools({
    mode: 'detach'
  });

  winTest.on('closed', () => {
    w = null
  });


});
