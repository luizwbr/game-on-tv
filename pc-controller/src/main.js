const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const StreamingServer = require('./server');

let mainWindow;
let streamingServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Initialize streaming server
  streamingServer = new StreamingServer();
  streamingServer.start();

  // Send server status to renderer
  streamingServer.on('status', (status) => {
    if (mainWindow) {
      mainWindow.webContents.send('server-status', status);
    }
  });

  streamingServer.on('client-connected', (clientInfo) => {
    if (mainWindow) {
      mainWindow.webContents.send('client-connected', clientInfo);
    }
  });

  streamingServer.on('client-disconnected', (clientId) => {
    if (mainWindow) {
      mainWindow.webContents.send('client-disconnected', clientId);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (streamingServer) {
    streamingServer.stop();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-server-info', async () => {
  if (streamingServer) {
    return streamingServer.getInfo();
  }
  return null;
});

ipcMain.handle('start-streaming', async (event, config) => {
  if (streamingServer) {
    return streamingServer.startStreaming(config);
  }
  return { success: false, error: 'Server not initialized' };
});

ipcMain.handle('stop-streaming', async () => {
  if (streamingServer) {
    return streamingServer.stopStreaming();
  }
  return { success: false, error: 'Server not initialized' };
});
