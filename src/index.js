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

let selectedSidebarButton;
document.querySelectorAll('#sidebar-left a').forEach(button => {
    const toolObj = {};
    toolObj.name = button.dataset.type;
    button.parentElement.onclick = function()  {
        selectedTool = this.children[1].dataset.type
        if(selectedSidebarButton) selectedSidebarButton.classList.remove('selected-sidebar-button');
        selectedSidebarButton = this.closest('.sidebar-button');
       selectedSidebarButton.classList.add('selected-sidebar-button');
    }
})

///////

let shapeBeingDrawn;
const resizeShape = (shape, params) => {

}
const draw  = () => {

}

delete Renderer.__plugins.interaction;
const app = new PIXI.Application({
    antialias:true,
    backgroundColor:0xffffff,
    width:700,
    height:500
});

const { renderer } = app;

renderer.addSystem(EventSystem, 'events');

const getMousePosition = (e) => {
    const rect = app.view.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {x: x, y: y};
}

const startDrawing = (e,type) => {
    const {x, y} = getMousePosition(e)
    const newGraphic = new PIXI.Graphics();
    newGraphic.lineStyle(1,0x000000);
    switch(type) {
        case 'rectangle':
            newGraphic.drawRect(x,y,30,30);
            break;
        case 'circle':
            newGraphic.drawCircle(x,y,30,30);
            break;
    }
    newGraphic.endFill();
    const texture = renderer.generateTexture(newGraphic);
    const sprite = new PIXI.Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5);
    app.stage.addChild(sprite)
}



document.querySelector('#lab-view').appendChild(app.view);
const addEvt  = () => document.querySelector('canvas').addEventListener('mousemove',(e) => draw(e));
const rmEvt  = () => document.querySelector('canvas').removeEventListener('mousemove', (e) => draw(e));

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

