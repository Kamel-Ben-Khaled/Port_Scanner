const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const { spawn} = require('child_process')

const log = require('electron-log')

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Port Scanner',
    width: isDev ? 800 : 500,
    height: 600,
    icon: './assets/icons/icon.png',
    resizable: isDev ? true : false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

ipcMain.on('send:cmd', (event,args) =>{
  console.log(args);
  sendCommand(args);

})

ipcMain.on('start:notepad', (event,args) =>{
  startProgram()
})

ipcMain.on('list:files', (event,args) =>{
startProgram()
})

})
ipcMain.on('get:webpage', (event,args) =>{
  console.log(args);
  getWebPage()

})


async function sendCommand(args){

  console.log("------------------")
  let ar = await [args.type,args.target ]
  //let ar = await ['-sS','207.154.224.208' ]
  console.log(ar);

  const nmap = spawn('nmap', ar);
  nmap.stdout.on('data', (data) => {
    console.log(`${data}`)
    mainWindow.webContents.send("cmd:done", `${data}`);

  });

  nmap.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  nmap.on('close', (code) => {
   console.log(`child process exited with code ${code}`);
  });
}

function getWebPage(){
  const child = require('child_process').execFile;
  const executablePath = "C:\\Windows\\System32\\notepad.exe";
  const parameters = [];
  })
}

function startProgram(){
  const child = require('child_process').execFile;
  const executablePath = "C:\\Windows\\System32\\notepad.exe";
  const parameters = [];

  // const executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  // const parameters = ["--incognito"];

  child(executablePath, parameters, function(err, data) {
      console.log(err)
      console.log(data.toString());
  });

}

async function getDir(args){
  const ar = await ['-al' ]
  //console.log(ar);

  const ls = spawn('ls');
  ls.stdout.on('data', (data) => {
    console.log(`${data}`)
    mainWindow.webContents.send("cmd:done", `${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
   console.log(`child process exited with code ${code}`);
  });
}

app.allowRendererProcessReuse = true
