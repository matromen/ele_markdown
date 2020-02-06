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


    Menu.setApplicationMenu(menu);



    ///////////globalShortcut is main.js 에서만 적용 됨.
    globalShortcut.register('CmdOrCtrl+s', ()=>{
        console.log('Saving the file');

        window.webContents.send('editor-event', 'save');
    });


    globalShortcut.register('CmdOrCtrl+o', ()=>{
        const options = {
            title: 'markdown 파일 선택',
            filters: [
                {
                    name: 'markdown 파일',
                    extensions : ['md']
                },
                {
                    name: 'text 파일',
                    extensions: ['txt']
                }
            ]
        }

        dialog.showOpenDialog(window, options)
        .then((result)=>{
            if(result.canceled === true || result.filePaths.length === 0 ){
                dialog.showErrorBox('!!!', '파일을 선택 해주세요.');
                return;
            }

            const content = fs.readFileSync(result.filePaths[0], {encoding: 'utf-8'});
            //const content = fs.readFileSync(result.filePaths[0]); content.toString();
            console.log(content);

            window.webContents.send('load', content);
        })
        .catch((err)=>{console.log(err);});
    });



});

