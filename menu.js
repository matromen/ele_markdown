//import { shell, Menu } from "electron";
const {shell, Menu, app, ipcMain, BrowserWindow, dialog} = require('electron');
const fs = require('fs');

const template = [
    {
        label: app.name
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'save File',
                accelerator: 'CmdOrCtrl+s',
                click: ()=>{
                    saveFile();
                }
            },
            {
                label: 'open File',
                accelerator: 'CmdOrCtrl+o',
                click: ()=>{
                    openFile();
                }
            }
        ]
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



let saveFile = function(){
    console.log('Saving the file');
    BrowserWindow.getFocusedWindow().webContents.send('editor-event', 'save');
}

let openFile = function(){
    const window = BrowserWindow.getFocusedWindow();
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

        BrowserWindow.getFocusedWindow().webContents.send('load', content);
    })
    .catch((err)=>{console.log(err);});


}



//////////////////ipc/////////////////////

ipcMain.on('editor-reply', (event, arg)=>{
    console.log(`Received reply form web page: ${arg}`);
});

///////////////showSavingDialog => save////////////////////
ipcMain.on('save', (event, arg)=>{
    console.log('Saving content of the file');
    console.log(arg);


    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [{
            name: 'markdown 파일',
            extensions: ['md']
        }]
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
///////////////showSavingDialog => save////////////////////
//////////////////ipc/////////////////////




module.exports = {
    menu: Menu.buildFromTemplate(template),
    saveFile: saveFile,
    openFile: openFile
}
