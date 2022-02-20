
import UI from './js/ui.js';
import PIXIManager from './js/pixi-manager.js';
const ElementQueries = require('css-element-queries/src/ElementQueries');

ElementQueries.listen();
ElementQueries.init();


class Main {
    constructor() {
        this.pixi = new PIXIManager();
        this.stage = new StageManager();
        const UI = new UI();

    }
}


new Main()

