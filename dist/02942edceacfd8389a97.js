
import 'jquery-ui/ui/widgets/resizable';
import UI from './js/ui.js';
import { EventSystem } from '@pixi/events';
import { Renderer } from '@pixi/core';
import * as bootstrap from 'bootstrap';
import gsap from 'gsap';
import PixiPlugin from "gsap/PixiPlugin";
import utils from './js/utils.js';
import PIXIManager from './js/pixi-manager.js';
const ElementQueries = require('css-element-queries/src/ElementQueries');
delete Renderer.__plugins.interaction;
ElementQueries.listen();
ElementQueries.init();
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

class Main {
    constructor() {
        this.pixi = new PIXIManager();
        this.stage = new StageManager();
        const UI = new UI();

    }
}



