import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent } from "@gsilber/webez";
import { GridComponent } from "./grid/grid.component";

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    constructor() {
        super(html, css);
        const grid = new GridComponent();
        this.addComponent(grid, "grid");
    }
}
