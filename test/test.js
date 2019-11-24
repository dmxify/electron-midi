const {
  app,
  BrowserWindow
} = require('electron')


let winTest; // global reference to test BrowserWindow


app.on('ready', () => {
  winTest = new BrowserWindow({
    name: 'electron-midi test',
    x: 50,
    y: 50,
    width: 600,
    height: 650,
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
