import { describe, expect, test, beforeAll } from "@jest/globals";
import { LightComponent } from "./light.component";
import { bootstrap } from "@gsilber/webez";

describe("LightComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<LightComponent>(LightComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(LightComponent);
        });
    });
});
