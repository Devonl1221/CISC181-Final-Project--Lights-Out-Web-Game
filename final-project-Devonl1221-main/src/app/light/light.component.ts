import {
    EzComponent,
    Click,
    EventSubject,
    BindAttribute,
    BindStyle,
    GenericEvent,
} from "@gsilber/webez";
import html from "./light.component.html";
import css from "./light.component.css";

export class LightComponent extends EzComponent {
    isOn: boolean;

    @BindStyle("light", "backgroundColor")
    lightColor: string = "";

    @BindStyle("light", "boxShadow")
    lightInnerBorder: string = "";

    @BindAttribute("light", "name", (id: number) => id.toString())
    private id: number;

    lightChangeEvent: EventSubject<number> = new EventSubject<number>();

    lightHoverOnEvent: EventSubject<number> = new EventSubject<number>();

    lightHoverOffEvent: EventSubject<number> = new EventSubject<number>();

    constructor(id: number) {
        super(html, css);
        this.isOn = Math.random() < 0.3;
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
     * in GridComponent and switches the corresponding light colors and isOn status
     */
    @Click("light")
    onLightClicked() {
        this.lightChangeEvent.next(this.id);
    }

    /**
     * @description Method that triggers the lightHoverEvent to call the
     * lightBorderChange method in GridComponent and temporarily changes
     * corresponding light border colors to white (as if being highlighted)
     */
    @GenericEvent("light", "mouseover")
    onLightHoverOn() {
        this.lightHoverOnEvent.next(this.id);
    }

    /**
     * @description Method that triggers the lightHoverEvent to call the
     * lightBorderChange method in GridComponent and temporarily changes
     * corresponding light border colors back to their original color
     */
    @GenericEvent("light", "mouseleave")
    onLightHoverOff() {
        this.lightHoverOffEvent.next(this.id);
    }
}
