import * as PIXI from 'pixi.js';
import Toast from './toast.js';
let selectedTool;

const tools = []
const app = new PIXI.Application({
    width:800,
    height:500,
    backgroundColor:0xffffff
});
document.querySelector('#lab-view').appendChild(app.view);

document.querySelectorAll('#sidebar-left a').forEach(button => {
    const toolObj = {}
    toolObj.name = button.dataset.type;
    button.parentElement.onclick = function()  {
        selectedTool = this.children[1].dataset.type;
    }
})
app.view.addEventListener('click', (e) => {
    if(!selectedTool) {
        new Toast('info','Please select a tool');

    }
})