import * as PIXI from 'pixi.js'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/resizable';
import {Application} from '@pixi/app';
import {EventSystem} from '@pixi/events';
import {Renderer} from '@pixi/core';
import * as bootstrap from 'bootstrap';
import gsap from 'gsap';
import PixiPlugin from "gsap/PixiPlugin";

const ElementQueries = require('css-element-queries/src/ElementQueries');
delete Renderer.__plugins.interaction;
$('#sidebar-left').resizable();
ElementQueries.listen();
ElementQueries.init();
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);


let selectedSidebarButton;
let selectedTool;
document.querySelectorAll('#sidebar-left a').forEach(button => {
    const toolObj = {};
    toolObj.name = button.dataset.type;
    button.parentElement.onclick = function () {
        selectedTool = this.children[1].dataset.type
        if (selectedSidebarButton) selectedSidebarButton.classList.remove('selected-sidebar-button');
        selectedSidebarButton = this.closest('.sidebar-button');
        selectedSidebarButton.classList.add('selected-sidebar-button');
        if (selectedTool === 'select') {
            toggleSelectMode(true);

        }
    }
})

const draw = () => {
}

const app = new PIXI.Application({
    antialias: true,
    backgroundColor: 0xffffff,
    width: 700,
    height: 500
});

PIXI.Graphics.prototype.drawDashedCircle = function (radius, x, y, rotation, dash, gap, offsetPercentage) {
    var circum = radius * 2 * Math.PI;
    var stepSize = dash+gap;
    var chunks = Math.ceil(circum / stepSize);
    var chunkAngle = (2*Math.PI)/chunks;
    var dashAngle = (dash/stepSize) * chunkAngle;
    var offsetAngle = offsetPercentage*chunkAngle;
    var a = offsetAngle;
    var p = {x:radius*Math.cos(a), y:radius*Math.sin(a)};
    this.moveTo(x + p.x, y + p.y);
    for (var i = 0; i < chunks; i++) {
        a = chunkAngle*i+offsetAngle;
        this.arc(x, y, radius, a, a+dashAngle);
        p = {x:radius*Math.cos(a+chunkAngle), y:radius*Math.sin(a+chunkAngle)};
        this.moveTo(x + p.x, y + p.y);
    }
}


const {renderer} = app;

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
        item.cloneTest()
    }
    item.cloneTest = () => {
        function drawDash(target,
                          x1,
                          y1,
                          x2,
                          y2,
                          dashLength = 5,
                          spaceLength = 5) {
            let x = x2 - x1;
            let y = y2 - y1;
            let hyp = Math.sqrt((x) * (x) + (y) * (y));
            let units = hyp / (dashLength + spaceLength);
            let dashSpaceRatio = dashLength / (dashLength + spaceLength);
            let dashX = (x / units) * dashSpaceRatio;
            let spaceX = (x / units) - dashX;
            let dashY = (y / units) * dashSpaceRatio;
            let spaceY = (y / units) - dashY;
            target.moveTo(x1, y1);
            while (hyp > 0) {
                x1 += dashX;
                y1 += dashY;
                hyp -= dashLength;
                if (hyp < 0) {
                    x1 = x2;
                    y1 = y2;
                }
                target.lineTo(x1, y1);
                x1 += spaceX;
                y1 += spaceY;
                target.moveTo(x1, y1);
                hyp -= spaceLength;
            }
            target.moveTo(x2, y2);
        }


        const outline = new PIXI.Graphics();
        outline.lineStyle(1, 0x000000);
        switch (item.props.shape) {
            case 'rectangle':
                // drawDash(outline,0,0,0,-10)
                outline.drawRect(0, 0, item.props.width, item.props.height);
                break;
            case 'circle':
                outline.drawCircle(0, 0, item.props.width, item.props.height);
                break
        }
        const texture = renderer.generateTexture(outline);
        const clone = new PIXI.Sprite(texture);
        let pointsArray = []
        let points = outline._geometry.graphicsData[0].points;

        let outline2 = new PIXI.Graphics()
        outline2.lineStyle(5, 0x16E300);

        if (item.props.shape === 'circle') {
            while (points.length > 2) {
                pointsArray.push(points.slice(0, 4));
                points.splice(0, 4);
                for (let i = 0; i < pointsArray.length; i++) {
                    drawDash(outline2, pointsArray[i][0], pointsArray[i][1], pointsArray[i][2], pointsArray[i][3])
                }

            }
        } else{
            drawDash(outline2, points[0], points[1], points[2], points[3])
            drawDash(outline2, points[2], points[3], points[4], points[5])
            drawDash(outline2, points[4], points[5], points[6], points[7])
            drawDash(outline2, points[6], points[7], points[0], points[1])


    }




        const tex = renderer.generateTexture(outline2);
        const final = new PIXI.Sprite(tex);


        app.stage.addChild(final);

        final.x = item.x;
        final.y = item.y;
        console.log(outline2)
      //  app.stage.addChild(clone);
        clone.x = item.x;
        clone.y = item.y;
        final.anchor.set(0.5);
        final.scale.set(1.4)
        final.alpha =1;


    }
}
const startDrawing = (e, type) => {
    const {x, y} = getMousePosition(e)
    const newGraphic = new PIXI.Graphics();
    newGraphic.lineStyle(3, 0x000000);
    switch (type) {
        case 'rectangle':
            newGraphic.drawRect(0, 0, 30, 30);
            break;
        case 'circle':
            newGraphic.drawCircle(0, 0, 30, 30);
            break;
    }
    newGraphic.endFill();
    const texture = renderer.generateTexture(newGraphic);
    const sprite = new PIXI.Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.graph = newGraphic;
    sprite.props = {};
    sprite.props.width = 30;
    sprite.props.height = 30;
    sprite.props.shape = selectedTool;
    sprite.anchor.set(0.5);
    setupItemMethods(sprite);
    app.stage.addChild(sprite)
    itemsOnStage.push(sprite);
}


const toggleSelectMode = (enabled) => {
    const modifyListeners = (item, listenersEnabled) => {
        if (listenersEnabled) {
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
    if (!enabled) {
        itemsOnStage.forEach(item => {
            modifyListeners(item, false);
        })
    } else {
        itemsOnStage.forEach(item => {
            modifyListeners(item, true);
        })
    }
}
document.querySelector('#lab-view').appendChild(app.view);
const addEvt = () => document.querySelector('canvas').addEventListener('mousemove', (e) => draw(e));
const rmEvt = () => document.querySelector('canvas').removeEventListener('mousemove', (e) => draw(e));

app.view.addEventListener('mousedown', function handleClick(e) {

    if (!selectedTool) {
        new bootstrap.Toast('#myToast').show();
    } else {
        addEvt();
        if (!nonDrawTools.includes(selectedTool)) {
            startDrawing(e, selectedTool);
            toggleSelectMode(false);

        } else {
            switch (selectedTool) {
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

