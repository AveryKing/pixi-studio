import * as PIXI from 'pixi.js'
import $ from 'jquery';
import jQuery from 'jquery';
import 'jquery-ui/ui/widgets/resizable';
import * as alert from 'bootstrap-alerts';
import Toast from './toast.js';
let selectedTool;

const ElementQueries = require('css-element-queries/src/ElementQueries');

// attaches to DOMLoadContent and does anything for you
ElementQueries.listen();

// or if you want to trigger it yourself:
// 'init' parses all available CSS and attach ResizeSensor to those elements which
// have rules attached (make sure this is called after 'load' event, because
// CSS files are not ready when domReady is fired.
ElementQueries.init();





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
        console.log(e.data.getLocalPosition(app.view))
    }
})

$('#sidebar-left').resizable();