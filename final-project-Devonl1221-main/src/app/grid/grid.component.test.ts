import { describe, expect, test, beforeAll } from "@jest/globals";
import { GridComponent } from "./grid.component";
import { bootstrap } from "@gsilber/webez";

describe("GridComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<GridComponent>(GridComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(GridComponent);
        });
    });
});
