import { describe, expect, test, beforeAll } from "@jest/globals";
import { MainComponent } from "./main.component";
import { bootstrap } from "@gsilber/webez";

describe("MainComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MainComponent>(MainComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(MainComponent);
        });
    });
});

