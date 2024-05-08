import {
    BindAttribute,
    BindStyle,
    Click,
    EventSubject,
    EzComponent,
    EzDialog,
    Input,
    ValueEvent,
} from "@gsilber/webez";
import html from "./grid.component.html";
import css from "./grid.component.css";
import { LightComponent } from "../light/light.component";

export class GridComponent extends EzComponent {
    private lights: LightComponent[] = [];
    private newestId = 0;
    private clickCount = 0;

    @BindAttribute("game-type", "value")
    private gameType: string = "Cardinal Neighbors";

    @BindAttribute("lights-color", "value")
    private lightsColor: string = "rgb(12, 204, 216)";

    @BindStyle("lights", "width")
    private width: string = "320px";

    @BindStyle("lights", "height")
    private height: string = "320px";

    @BindStyle("lights", "gridTemplateColumns")
    private gridTemplateColumns: string = "repeat(5, 64px)";

    @BindStyle("lights", "gridTemplateRows")
    private gridTemplateRows: string = "repeat(5, 64px)";

    lightChangeEvent: EventSubject<LightComponent[]> = new EventSubject();

    gameTypeChangeEvent: EventSubject = new EventSubject();

    gameColorChangeEvent: EventSubject = new EventSubject();

    widthChangeEvent: EventSubject = new EventSubject();

    heightChangeEvent: EventSubject = new EventSubject();

    constructor() {
        super(html, css);
        this.newGame();
    }

    @Input("game-type")
    gameTypeSelect(e: ValueEvent) {
        this.gameTypeChangeEvent.subscribe(() => {
            this.gameType = e.value.toString();
        });
    }

    @Input("lights-color")
    lightColorSelect(e: ValueEvent) {
        this.lightsColor = e.value.toString();
        for (let light of this.lights) {
            if (light.isOn) {
                light.lightColor = this.lightsColor;
            }
        }
    }

    @Input("width-slider")
    widthSelect(e: ValueEvent) {
        this.widthChangeEvent.subscribe(() => {
            let newValue = 64 * +e.value;
            this.width = `${newValue.toString()}px`;
            this.gridTemplateColumns = `repeat(${e.value.toString()}, 64px)`;
        });
    }

    @Input("height-slider")
    heightSelect(e: ValueEvent) {
        this.heightChangeEvent.subscribe(() => {
            let newValue = 64 * +e.value;
            this.height = `${newValue.toString()}px`;
            this.gridTemplateRows = `repeat(${e.value.toString()}, 64px)`;
        });
    }

    @Click("new-game")
    newGame() {
        this.gameTypeChangeEvent.next();
        this.widthChangeEvent.next();
        this.heightChangeEvent.next();
        this.resetLights();
    }

    resetLights() {
        this.removeLights();
        this.addLights();
    }

    /**
     * @description Method that adds lights to grid depending on game size
     */
    addLights() {
        let numberOfLights: number =
            this.parseSize(this.width) * this.parseSize(this.height);
        for (let i = 0; i < numberOfLights; i += 1) {
            let newLight = new LightComponent(this.newestId);
            this.addComponent(newLight, "lights");
            this.lights.push(newLight);
            this.newestId += 1;
            newLight.lightChangeEvent.subscribe((id: number) => {
                if (this.gameType === "Cardinal Neighbors") {
                    this.lightChange(this.cardinalNeighbors(id));
                } else if (this.gameType === "Diagonal Neighbors") {
                    this.lightChange(this.diagonalNeighbors(id));
                } else {
                    this.lightChange(this.rowsAndColumns(id));
                }
                this.winGame();
            });
        }
    }

    /**
     * @description Method that removes lights from grid depending on added lights
     */
    removeLights() {
        for (let i = 0; i < this.lights.length; i += 1) {
            this.removeComponent(this.lights[i]);
        }
        this.newestId = 0;
        this.lights = [];
    }

    /**
     * @description Method that returns a victory popup if all lights are off (
     * the isOn fields are all false)
     */
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
                this.lights[id].lightColor = this.lightsColor;
            }
            this.lights[id].isOn = !this.lights[id].isOn;
        }
    }

    /**
     * @description Method that take an id of a clicked light and returns a list
     * of light ids that are above, below, and to the sides of the given id.
     * @param id The id of a clicked light
     * @returns List of ids that correspond to selected game type
     */
    cardinalNeighbors(id: number): number[] {
        let targetIds: number[] = [];
        const verticalIdDistance: number = this.parseSize(this.width);
        const topRightId: number = verticalIdDistance - 1;
        const bottomLeftId: number =
            this.parseSize(this.width) * (this.parseSize(this.height) - 1);
        const bottomRightId: number =
            this.parseSize(this.width) * this.parseSize(this.height) - 1;
        const cardinals: number[] = [
            id - verticalIdDistance,
            id + verticalIdDistance,
            id + 1,
            id - 1,
        ];

        // Conditions for top row (top right, top right, and middle ids respectively)
        if (id <= topRightId) {
            if (id === 0) {
                targetIds = [id, ...cardinals.slice(1, 3)];
            } else if (id === topRightId) {
                targetIds = [id, cardinals[1], cardinals[3]];
            } else {
                targetIds = [id, ...cardinals.slice(2), cardinals[1]];
            }
            // Conditions for bottom row (bottom left, bottom right, and middle ids respectively)
        } else if (id >= bottomLeftId) {
            if (id === bottomLeftId) {
                targetIds = [id, cardinals[0], cardinals[2]];
            } else if (id === bottomRightId) {
                targetIds = [id, cardinals[0], cardinals[3]];
            } else {
                targetIds = [id, ...cardinals.slice(2), cardinals[0]];
            }
            // Conditions for left and right columns respectively
        } else if (this.isLeftOrRight(id, verticalIdDistance) === "left") {
            targetIds = [id, ...cardinals.slice(0, 3)];
        } else if (this.isLeftOrRight(id, verticalIdDistance) === "right") {
            targetIds = [id, ...cardinals.slice(0, 2), cardinals[3]];
        } else {
            targetIds = [id, ...cardinals];
        }
        let filterIds = targetIds.filter(
            (id: number) => id >= 0 && id <= bottomRightId,
        );
        return filterIds;
    }

    /**
     * @description Method that take an id of a clicked light and returns a list
     * of light ids that are diagonal to the given id.
     * @param id The id of a clicked light
     * @returns List of ids that correspond to selected game type
     */
    diagonalNeighbors(id: number): number[] {
        let targetIds: number[] = [];
        const verticalIdDistance: number = this.parseSize(this.width);
        const topRightId: number = verticalIdDistance - 1;
        const bottomLeftId: number =
            this.parseSize(this.width) * (this.parseSize(this.height) - 1);
        const bottomRightId: number =
            this.parseSize(this.width) * this.parseSize(this.height) - 1;
        const diagonals: number[] = [
            id - verticalIdDistance - 1,
            id - verticalIdDistance + 1,
            id + verticalIdDistance - 1,
            id + verticalIdDistance + 1,
        ];
        // Conditions for top row
        if (id <= topRightId) {
            if (id === 0) {
                targetIds = [id, diagonals[3]];
            } else if (id === topRightId) {
                targetIds = [id, diagonals[2]];
            } else {
                targetIds = [id, ...diagonals.slice(2)];
            }
            // Conditions for bottom row
        } else if (id >= bottomLeftId) {
            if (id === bottomLeftId) {
                targetIds = [id, diagonals[1]];
            } else if (id === bottomRightId) {
                targetIds = [id, diagonals[0]];
            } else {
                targetIds = [id, ...diagonals.slice(0, 2)];
            }
            // Conditions for left and right columns respectively
        } else if (this.isLeftOrRight(id, verticalIdDistance) === "left") {
            targetIds = [id, diagonals[1], diagonals[3]];
        } else if (this.isLeftOrRight(id, verticalIdDistance) === "right") {
            targetIds = [id, diagonals[0], diagonals[2]];
        } else {
            targetIds = [id, ...diagonals];
        }
        let filterIds = targetIds.filter(
            (id: number) => id >= 0 && id <= bottomRightId,
        );
        return filterIds;
    }

    /**
     * @description Method that take an id of a clicked light and returns a list
     * of light ids that are in the same row and column as the given id.
     * @param id The id of a clicked light
     * @returns List of ids that correspond to selected game type
     */
    rowsAndColumns(id: number): number[] {
        let targetIds: number[] = [];
        let verticalIdDistance: number = this.parseSize(this.width);
        let bottomRightId: number =
            this.parseSize(this.width) * this.parseSize(this.height) - 1;
        // Pushes the ids of all the lights in the same columnn as the given light id
        for (
            let i = -this.parseSize(this.height) + 1;
            i < this.parseSize(this.height);
            i += 1
        ) {
            if (i === 0) {
                null;
            } else {
                const verticalId = id + verticalIdDistance * i;
                targetIds.push(verticalId);
            }
        }
        // Pushes the ids of all the lights in the same row as the given light id
        // including the given light
        targetIds.push(...this.rowIds(id, verticalIdDistance));
        // Filters the list of light ids to remove ids outside grid range
        let filterIds = targetIds.filter(
            (id: number) => id >= 0 && id <= bottomRightId,
        );
        return filterIds;
    }

    /**
     * @description Method that takes a string of a pixel size (Ex. "320px") and returns the
     * numeric value divided by 64 (determines how many 64px lights to fit in grid).
     * @param value
     */
    parseSize(value: string): number {
        let newValue = value.slice(0, -2);
        return +newValue / 64;
    }

    /**
     * @description Method that is simply to determine whether a light id is in
     * the left or right columns or neither
     * @param value
     * @param multiple
     * @returns String value of the column
     */
    isLeftOrRight(value: number, multiple: number): string {
        if (value % multiple === 0) {
            return "left";
        } else if (value % multiple === this.parseSize(this.width) - 1) {
            return "right";
        } else {
            return "neither";
        }
    }

    /**
     * @description Method that takes an id and a number as a multiple (based on
     * grid length) and returns a list of light ids in the same row as the
     * given id (* I love this method *)
     * @param id
     * @param multiple
     * @returns List of light Ids in the same row as the given id including the
     * given id
     */
    rowIds(id: number, multiple: number): number[] {
        let horizontalIds = [];
        // i = distance from the left column
        let i = id % multiple;
        for (let j = 0; j < multiple; j += 1) {
            horizontalIds.push(id - i + j);
        }
        return horizontalIds;
    }
}
