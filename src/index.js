import * as PIXI from 'pixi.js';

const selectedTool = 'none';

const tools = [
    {name: "rectangle"},
    {name: "circle"},
    {name: "line"},
    {name: "text"},
    {name: "filters"},
    {name: "animations"},
]
const app = new PIXI.Application({
    width:800,
    height:500,
    backgroundColor:0xffffff
});
document.querySelector('#lab-view').appendChild(app.view);