const { contextBridge } = require('electron')
const { BrowserWindow, dialog } = require('@electron/remote')
const { electronAPI } = require('@electron-toolkit/preload')
const fs = require('fs')

const api = {
    BrowserWindow,
    dialog,
    fs,
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
}

module.exports = async function loadFile() {
    const filePaths = await dialog.showOpenDialog({
        filters: [{ name: 'drawdb diagram', extensions: ['drawdb'] }]
    })
    if (filePaths.canceled) return
    const filePath = filePaths[0]

    try {
        console.log(fs.readFileSync(filePath, 'utf-8'))
        console.log('Loaded file:' + filePath)
    } catch (err) {
        console.log('Error reading the file: ' + JSON.stringify(err))
    }
}
