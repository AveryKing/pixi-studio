import * as PIXI from 'pixi.js'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/resizable';
import { Application } from '@pixi/app';
import { EventSystem } from '@pixi/events';
import { Renderer } from '@pixi/core';
import * as bootstrap from 'bootstrap';
const ElementQueries = require('css-element-queries/src/ElementQueries');
delete Renderer.__plugins.interaction;
$('#sidebar-left').resizable();
ElementQueries.listen();
ElementQueries.init();


let selectedSidebarButton;
let selectedTool;
document.querySelectorAll('#sidebar-left a').forEach(button => {
    const toolObj = {};
    toolObj.name = button.dataset.type;
    button.parentElement.onclick = function()  {
        selectedTool = this.children[1].dataset.type
        if(selectedSidebarButton) selectedSidebarButton.classList.remove('selected-sidebar-button');
        selectedSidebarButton = this.closest('.sidebar-button');
       selectedSidebarButton.classList.add('selected-sidebar-button');
       if(selectedTool === 'select') {
           toggleSelectMode(true);

       }
    }
})

const draw  = () => {}

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

const itemsOnStage = [];
const nonDrawTools = ['select', 'move'];
let selectedItem;

const setupItemMethods = (item) => {
    item.showMouseOver = () => {
        console.log('over')
        item.buttonMode = true;
        item.alpha = 0.7;
    }
    item.stopMouseOver = () => {
        console.log('out')
        item.buttonMode = false;
        item.alpha = 1;
    }
    item.doSelect = () => {
        alert('selected')

    }
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
    setupItemMethods(sprite);
    app.stage.addChild(sprite)
    itemsOnStage.push(sprite);
}


const toggleSelectMode = (enabled) => {
    const modifyListeners = (item, listenersEnabled) => {
        if(listenersEnabled) {
            item.interactive = true;
            item.addEventListener('mouseover', item.showMouseOver);
            item.addEventListener('mousedown', item.doSelect);
            item.addEventListener('mouseout', item.stopMouseOver);

        } else {
            item.removeEventListener('mouseover', item.showMouseOver);
            item.removeEventListener('mouseout', item.stopMouseOver);
            item.removeEventListener('mousedown', item.doSelect);
        }
    }
    if(!enabled) {
        itemsOnStage.forEach(item => {
            modifyListeners(item,false);
        })
    } else {
        itemsOnStage.forEach(item => {
            modifyListeners(item, true);
        })
    }
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
        if(!nonDrawTools.includes(selectedTool)) {
            startDrawing(e,selectedTool);
            toggleSelectMode(false);

        } else {
            switch(selectedTool) {
                case 'select':
                    break;
                case 'move':
                    break;
            }
        }
    }
});

app.view.addEventListener('mouseup', rmEvt);
renderer.render(app.view);

