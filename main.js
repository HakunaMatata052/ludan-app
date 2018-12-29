const electron = require('electron')

const ipc = electron.ipcMain

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
const Menu = electron.Menu;
const Tray = electron.Tray;

const path = require('path');
//托盘对象
var appTray = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    center: true,
    skipTaskbar: true,
    show: false,
    title: '录单系统-v1.0',
    icon: `${__dirname}/tray/app.ico`,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
  })
  //系统托盘右键菜单
  var trayMenuTemplate = [{
      label: '打开网页版',
      click: function () {
        electron.shell.openExternal('http://192.168.0.202:8088/');
      }
    }, {
      label: '录单',
      click: function () {
        mainWindow.loadURL(`file://${__dirname}/app/index.html#home`)
      }
    }, {
      label: '服务器',
      click: function () {
        mainWindow.loadURL(`file://${__dirname}/app/index.html#server`)
      }
    },
    {
      label: '退出',
      click: function () {
        app.quit();
      }
    }
  ];

  //系统托盘图标目录
  trayIcon = path.join(__dirname, 'tray');

  appTray = new Tray(path.join(trayIcon, 'app.ico'));

  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('录单系统.');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);

  appTray.on('click', function () {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
  mainWindow.maximize()
  mainWindow.show()
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


//登录窗口最小化
ipc.on('window-min', function () {
  mainWindow.minimize();
})
//登录窗口最大化
ipc.on('window-max', function () {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
})
ipc.on('window-close', function () {
    mainWindow.close();
  })