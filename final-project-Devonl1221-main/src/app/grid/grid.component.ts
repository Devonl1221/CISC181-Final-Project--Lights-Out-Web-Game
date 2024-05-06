import {
    BindStyle,
    Click,
    EventSubject,
    EzComponent,
    EzDialog,
} from "@gsilber/webez";
import html from "./grid.component.html";
import css from "./grid.component.css";
import { LightComponent } from "../light/light.component";

export class GridComponent extends EzComponent {
    private lights: LightComponent[] = [];
    private newestId = 0;
    private clickCount = 0;

    @BindStyle("lights", "width")
    private width: string = "320px";

    @BindStyle("lights", "height")
    private height: string = "320px";

    //resetLightsEvent: EventSubject<LightComponent[]> = new EventSubject();
    lightChangeEvent: EventSubject<LightComponent[]> = new EventSubject();

    constructor() {
        super(html, css);
        this.newGame();
    }

    @Click("new-game")
    newGame() {
        this.resetLights();
    }

    resetLights() {
        this.newestId = 0;
        // adjust to fit different game sizes
        for (let i = 0; i < 25; i += 1) {
            this.removeLight(i);
            this.addLight();
        }
    }

    addLight() {
        const newLight = new LightComponent(this.newestId);
        this.addComponent(newLight, "lights");
        this.lights.push(newLight);
        this.newestId += 1;
        newLight.lightChangeEvent.subscribe((id: number) => {
            this.lightChange(this.cardinalNeighbors(id));
            this.winGame();
        });
    }

    removeLight(targetId: number) {
        for (let i = 0; i < this.lights.length; i += 1) {
            if (this.lights[i].getId() === targetId) {
                const removedLights = this.lights.splice(i, 1);
                for (let j of removedLights) {
                    this.removeComponent(j);
                }
            }
        }
    }

    winGame() {
        if (
            this.lights.filter((light: LightComponent) => light.isOn).length ===
            0
        ) {
            EzDialog.popup(
                this,
                `Number of clicks: ${this.clickCount}`,
                "You win!",
            );
            this.newGame();
            this.clickCount = 0;
            // change to reset game when player clicks "ok"
        } else {
            this.clickCount += 1;
        }
    }

    /**
     * @description Method that takes a list of ids and change the corresponding
     * lights' colors and isOn status
     * @param ids The list of given light ids
     */
    lightChange(ids: number[]) {
        for (let id of ids) {
            if (this.lights[id].isOn) {
                this.lights[id].lightColor = "rgb(99, 99, 99)";
            } else {
                this.lights[id].lightColor = "rgb(12, 204, 216)";
            }
            this.lights[id].isOn = !this.lights[id].isOn;
        }
    }

    // Create method for making lightChangeEvent more efficient?
    // different methods/functions for different game types?

    cardinalNeighbors(id: number): number[] {
        // do something to determine game size?
        let targetIds: number[] = [];
        // Conditions for grid width
        if (id < 5) {
            if (id === 0) {
                targetIds = [id, id + 1, id + 5];
            } else if (id === 4) {
                targetIds = [id, id - 1, id + 5];
            } else {
                targetIds = [id, id - 1, id + 1, id + 5];
            }
        } else if (id >= 20) {
            if (id === 20) {
                targetIds = [id, id - 5, id + 1];
            } else if (id === 24) {
                targetIds = [id, id - 1, id - 5];
            } else {
                targetIds = [id, id - 1, id + 1, id - 5];
            }
            // Conditions for grid height
        } else if (id === 5 || id === 10 || id === 15) {
            targetIds = [id, id + 1, id + 5, id - 5];
        } else if (id === 9 || id === 14 || id === 19) {
            targetIds = [id, id - 1, id + 5, id - 5];
        } else {
            targetIds = [id, id + 1, id - 1, id + 5, id - 5];
        }
        let filterIds = targetIds.filter((id: number) => id >= 0 && id < 25);
        return filterIds;
    }

    diagonalNeighbors() {}

    rowsAndColumns() {}
}
