const electron = require('electron');
const {app,BrowserWindow} = electron;

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false
        //    transparent: true,
        //     frame: false
    });
    //  win.setMenu(null);
    win.loadURL(`file://${__dirname}/index.html`);
    win.once('ready-to-show', () => {
        win.show()
    })
});