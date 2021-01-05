/*
 * @Description:
 * @Date: 2020-12-25 14:44:41
 * @LastEditTime: 2021-01-05 09:53:07
 * @FilePath: \electron-cat\main.js
 */
const { screen, ipcMain, Menu, app, BrowserWindow, Tray } = require('electron');
const Positioner = require('electron-positioner');
const path = require('path')

let mainWindow = BrowserWindow.getFocusedWindow();
let mainWindowPositioner;
let win = null
let appTray = null

// 隐藏菜单栏
Menu.setApplicationMenu(null)
function createWindow () {
  win = new BrowserWindow({
    width: 230,
    height: 325,
    frame: false,
    skipTaskbar: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    allowRunningInsecureContent: true,
    experimentalCanvasFeatures: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  //系统托盘右键菜单
  let trayMenuTemplate = [
    {
      label: '退出喵~',
      click: function () {
        //ipc.send('close-main-window');
        app.quit();
      }
    }
  ]

  //系统托盘图标目录
  trayIcon = path.join(__dirname, 'public');

  appTray = new Tray(path.join(trayIcon, 'app.png'));

  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('Desktop Neko');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);

  win.loadFile('index.html')

  win.isAlwaysOnTop()

  // win.setKiosk(true)

  // win.moveTop()

  // console.log('createWindow', win);
  win.on('ready-to-show', () => {
    // if (!winBounds) {
    mainWindowPositioner = new Positioner(win);
    mainWindowPositioner.move('bottomRight');
    // }

    win.show();
  });

}
function setPosition () {
  let winW = screen.getPrimaryDisplay().workAreaSize.width;
  let winH = screen.getPrimaryDisplay().workAreaSize.height;
  // win.x = winW - 230
  // win.y = winH - 325
  console.log('width', winW, 'height', winH);
  // console.log(win);
};

//置顶
ipcMain.on('window-top', () => {
  if (mainWindow.isAlwaysOnTop()) {
    mainWindow.setAlwaysOnTop(false);
    BrowserWindow.getFocusedWindow().webContents.send('alwaysOnTop', 'no');
  } else {
    mainWindow.setAlwaysOnTop(true);
    BrowserWindow.getFocusedWindow().webContents.send('alwaysOnTop', 'yes');
  }
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  setPosition()
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
  console.log('activate', win);
})

app.on('ready', () => {
  console.log('ready');
  // setPosition()
})
