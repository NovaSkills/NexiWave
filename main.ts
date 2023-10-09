const DiscordRPC = require('discord-rpc');
const { app, BrowserWindow } = require('electron')
const path = require('path')
const clientId = '1158813932325183538'; 

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

rpc.on('ready', () => {
  console.log('RPC Is running');
  rpc.setActivity({
    details: 'Browsing Youtube Music',
    type: 2,
    startTimestamp,
    largeImageKey: 'nexi',
    largeImageText: 'NexiWave'
  });    
});

rpc.login({ clientId }).catch(console.error);


function createWindow() {
  const win = new BrowserWindow({
    width: 2000,
    height: 900,
    center: true,
    title: "NexiWave",
    autoHideMenuBar: true,
    
    webPreferences: {
      preload: path.join(__dirname, 'test.js')
    }
  })

 win.loadFile('app/index.html')

  win.webContents.on('did-navigate', (event, url) => {
    if (url === 'https://music.youtube.com/tasteprofile/') { // Replace with your desired URL
      // Execute your code when the specific URL is loaded.
      win?.webContents.executeJavaScript(`
      const element = document.querySelector('.style-scope ytmusic-tastebuilder-renderer');
        if (element) {
          element.innerHTML = 'Welcome to NexiWave, Please select the home tab.';
        } else {
          console.error('Element not found.');
        }
      `);
    }
  });
  win.webContents.on('did-navigate', (event, url) => {
    if (url === 'https://music.youtube.com/') { // Replace with your desired URL
      // Execute your code when the specific URL is loaded.
      win?.webContents.executeJavaScript(`
      const element = document.querySelector('.style-scope ytmusic-search-box');
      if (element) {
        element.innerHTML = 'Welcome to NexiWave, Please Login.';
      } else {
        console.error('Element not found.');
      }
      
      `);
    }
  });
}



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})