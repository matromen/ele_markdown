const {app, BrowserWindow, Menu, globalShortcut, dialog} = require('electron');
const menu = require('./menu');
const fs = require('fs');

let window;

app.on('ready', ()=>{
    window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true 
        },
        width: 800, heigth: 600
    });

    window.loadFile('index.html');


    Menu.setApplicationMenu(menu.menu);



    ///////////globalShortcut is main.js 에서만 적용 됨.
    globalShortcut.register('CmdOrCtrl+s', ()=>{
        try{
            menu.saveFile();
        }catch(error){
            console.log(error);
        }
    });


    globalShortcut.register('CmdOrCtrl+o', ()=>{
        try{
            menu.openFile();
        }catch(error){
            console.log(error);
        }
    });

});

