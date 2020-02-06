//import { shell, Menu } from "electron";
const {shell, Menu, app, ipcMain, BrowserWindow, dialog} = require('electron');
const fs = require('fs');

const template = [
    {
        label: app.name
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Componet',
                //click() {
                click: ()=>{
                    shell.openExternal('https://simplemde.com/');
                }
            }
        ]
    },

];

if(process.platform === 'darwin'){
    template.unshift({
        label: app.name,
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    });
}

if(process.env.DEBUG){
    template.push(
        {
            label: 'Debug',
            submenu: [
                {
                    label: 'Deb Tools',
                    role: 'toggleDevTools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'reload',
                    accelerator: 'Alt+R'
                }
            ]
        }
    );
}

template.unshift({
    label: 'Format',
    submenu: [
        {
            label: 'Toggle Bold',
            click: ()=>{
                const window = BrowserWindow.getFocusedWindow();   //새로운 윈도(랜더러)가 아닌 현재 포커스된 현재 윈도우
                window.webContents.send('editor-event', 'toggle-bold');
            }
        }
    ]
});



ipcMain.on('editor-reply', (event, arg)=>{
    console.log(`Received reply form web page: ${arg}`);
});

ipcMain.on('save', (event, arg)=>{
    console.log('Saving content of the file');
    console.log(arg);

    ////////showSavingDialog => save////////////////////
    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: {
            name: 'MyFile',
            extensions: ['md']
        }
    };

    dialog.showSaveDialog(window, options)
    .then( (result)=> {
        if(result.canceled === true || result.filePath === 'undefined'){
            dialog.showErrorBox('error','파일을 생성 할 수 없습니다.1');
            return;
        }

  
        fs.writeFile(result.filePath, arg, (err)=>{
            if(err) {
                dialog.showErrorBox('error','파일을 생성 할 수 없습니다.2');
                return;
            };
        });

        dialog.showMessageBox(window, {title: 'OK', message: '좋아'});
       
    }).catch((error)=>{console.log(error);});

});

console.log('test');

// var menu = Menu.buildFromTemplate(template);
// module.exports = menu;

module.exports = Menu.buildFromTemplate(template);
