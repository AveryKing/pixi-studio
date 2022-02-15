import * as PIXI from 'pixi.js'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/resizable';
import { Application } from '@pixi/app';
import { EventSystem } from '@pixi/events';
import { Renderer } from '@pixi/core';
import * as bootstrap from 'bootstrap';
let selectedTool;

const ElementQueries = require('css-element-queries/src/ElementQueries');
$('#sidebar-left').resizable();
// attaches to DOMLoadContent and does anything for you
ElementQueries.listen();

// or if you want to trigger it yourself:
// 'init' parses all available CSS and attach ResizeSensor to those elements which
// have rules attached (make sure this is called after 'load' event, because
// CSS files are not ready when domReady is fired.
ElementQueries.init();

const tools = []
let shapeBeingDrawn;

document.querySelectorAll('#sidebar-left a').forEach(button => {
    const toolObj = {}
    toolObj.name = button.dataset.type;
    button.parentElement.onclick = function()  {
        selectedTool = this.children[1].dataset.type;
    }
})

const resizeShape = (shape, params) => {

}


delete Renderer.__plugins.interaction;
const app = new PIXI.Application({
    backgroundColor:0xffffff
});

const getMousePosition = (e) => {
    const rect = app.view.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {x: x, y: y};
}
const draw  = () => {

}

const startDrawing = (e,type) => {
    const {x, y} = getMousePosition(e)
    const newGraphic = new PIXI.Graphics();
    newGraphic.lineStyle(1,0x000000);
    switch(type) {
        case 'rectangle':
            newGraphic.drawRect(0,0,10,10);
            break;
        case 'circle':
            newGraphic.drawCircle(0,0,10,10);
            break;
    }
    newGraphic.x = x;
    newGraphic.y = y;
    newGraphic.endFill();
    app.stage.addChild(newGraphic)
}



const { renderer } = app;
renderer.addSystem(EventSystem, 'events');
document.querySelector('#lab-view').appendChild(app.view);
const addEvt  = () => document.querySelector('canvas').addEventListener('mousemove', draw);
const rmEvt  = () => document.querySelector('canvas').removeEventListener('mousemove', draw);

app.view.addEventListener('mousedown', function handleClick(e)
{

    if(!selectedTool) {
        new bootstrap.Toast('#myToast').show();
    } else {
        addEvt();
        startDrawing(e,selectedTool);
    }
});

app.view.addEventListener('mouseup', rmEvt);
renderer.render(app.view);

