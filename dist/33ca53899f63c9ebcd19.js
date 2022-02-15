import * as PIXI from 'pixi.js'
import $ from 'jquery';
import 'jquery-ui/ui/widgets/resizable';
import * as bt from 'bootstrap-toaster';
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
        let toast = {
            title: "Notice",
            message: "Please select a tool",
            status: TOAST_STATUS.SUCCESS,
            timeout: 5000
        }
       Toast.create(toast);
    }
})

$('#sidebar-left').resizable();