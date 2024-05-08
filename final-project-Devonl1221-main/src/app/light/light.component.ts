import {
    EzComponent,
    Click,
    EventSubject,
    BindAttribute,
    BindStyle,
} from "@gsilber/webez";
import html from "./light.component.html";
import css from "./light.component.css";

export class LightComponent extends EzComponent {
    isOn: boolean;

    @BindStyle("light", "backgroundColor")
    lightColor: string = "";

    @BindAttribute("light", "name", (id: number) => id.toString())
    private id: number;

    lightChangeEvent: EventSubject<number> = new EventSubject<number>();

    constructor(id: number) {
        super(html, css);
        this.isOn = Math.random() < 0.35;
        this.id = id;
        if (this.isOn) {
            this.lightColor = "rgb(12, 204, 216)";
        } else {
            this.lightColor = "rgb(99, 99, 99)";
        }
    }

    getId(): number {
        return this.id;
    }

    /**
     * @description Method that triggers lightChangeEvent to call lightChange method
     * in GridComponent and switch the corresponding light colors and isOn status
     */
    @Click("light")
    onLightClicked() {
        this.lightChangeEvent.next(this.id);
    }
}
