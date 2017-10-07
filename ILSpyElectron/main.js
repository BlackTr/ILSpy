'use strict'

const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
var edge = require('electron-edge-js');
const
	Conf = require('conf'),
	config = new Conf()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1024, height: 768})
  win.setMenu(null);

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if (config.get('debug')) {
  	win.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	app.quit();
})

app.on('activate', () => {
})

// Listen for async message from renderer process
ipcMain.on('async', (event, arg) => {  
    console.log(arg);
    // Reply on async message from renderer process
    event.sender.send('async-reply', 2);
    // Send value synchronously back to renderer process
    //event.returnValue = 4;
	// Send async message to renderer process
    //mainWindow.webContents.send('ping', 5);
});

// Make method externaly visible
exports.pong = arg => {  
    console.log(arg);
}

exports.showDevTools = arg => {  
	if (arg)
    	win.webContents.openDevTools();
    else
    	win.webContents.closeDevTools();
}