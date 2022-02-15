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

const drawRectangle = () => {
    console.log('drawing');
}
document.querySelectorAll('#sidebar-left a').forEach(button => {
    const toolObj = {}
    toolObj.name = button.dataset.type;
    button.parentElement.onclick = function()  {
        selectedTool = this.children[1].dataset.type;
    }
})
let isDrawing;
const startDrawRectangle = () => {
    if(selectedTool === 'rectangle') {
    }
}
delete Renderer.__plugins.interaction;
const app = new PIXI.Application();
const { renderer } = app;
const stage = app.stage;
renderer.addSystem(EventSystem, 'events');
document.querySelector('#lab-view').appendChild(app.view);
const addEvt  = () => document.querySelector('canvas').addEventListener('mousemove', draw);
const rmEvt  = () => document.querySelector('canvas').removeEventListener('mousemove', draw);
app.view.addEventListener('mousedown', function handleClick()
{
    if(!selectedTool) {
        new bootstrap.Toast('#myToast').show();
    } else {
        addEvt();
        switch(selectedTool) {
            case 'rectangle':
                drawRectangle();
                break;
        }
    }
});

app.view.addEventListener('mouseup', rmEvt);
// Render stage so that it becomes the root target for UI events
renderer.render(app.view);
/*
app.view.on('click', function (e)  {
    if(!selectedTool) {
      new bootstrap.Toast('#myToast').show();
        } else {
        switch(selectedTool) {
            case 'rectangle':
                addEvt();
                break;
        }
    }
})

app.view.on('pointerup', function() {
    rmEvt();
})
*/
