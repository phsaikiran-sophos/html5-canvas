import { Color, Mouse, Scroll } from "../types";
import Screen from "./screen";

class Common {
    color: Color;
    mouse: Mouse;
    relMouse: Mouse;
    scroll: Scroll;
    canvas: {
        height: number,
        width: number
    }
    screenList: Screen[];
    clickStatus: "mouseDown" | "mouseUp";

    constructor() {
        this.color = {
            pallet: [
                '#0E4061',
                '#67B3E6',
                '#1F93E0',
                '#60676B',
                '#1871AD',
                '#BFAC9B',
                '#D98F4E',
                '#BF6E3F',
                '#A6583C',
                '#5C2F24'
            ]
        };
        this.mouse = {
            x: 0,
            y: 0
        };
        this.relMouse = {
            x: 0,
            y: 0
        };
        this.scroll = {
            top: 0,
            left: 0
        };
        this.canvas = {
            height: window.innerHeight * 0.4,
            width: Math.min(window.innerWidth * 0.8, 1000)
        };
        this.screenList = [];
        this.clickStatus = "mouseUp";
    }
}

let common = new Common();

window.addEventListener("mousemove", (event) => {
    common.relMouse.x = event.x;
    common.relMouse.y = event.y;
    common.mouse.x = common.relMouse.x + common.scroll.left;
    common.mouse.y = common.relMouse.y + common.scroll.top;
});

window.addEventListener("scroll", () => {
    const html = document.querySelector('html');
    common.scroll.left = html!.scrollLeft;
    common.scroll.top = html!.scrollTop;
    common.mouse.x = common.relMouse.x + common.scroll.left;
    common.mouse.y = common.relMouse.y + common.scroll.top;
});

let whileMouseDown = () => {
    if (common.clickStatus === "mouseDown") {
        common.screenList.forEach((scr) => {
            if (common.relMouse.x >= scr.screenX &&
                common.relMouse.x <= scr.screenX + scr.width &&
                common.relMouse.y >= scr.screenY &&
                common.relMouse.y <= scr.screenY + scr.height
            ) {
                scr.onClick(common.relMouse.x - scr.screenX, common.relMouse.y - scr.screenY);
            }
        });
    }
}

// @ts-ignore
window.addEventListener("mousedown", (event) => {
    common.clickStatus = "mouseDown";
    whileMouseDown();
});

// @ts-ignore
window.addEventListener("mouseup", (event) => {
    common.clickStatus = "mouseUp";
});

export default common;
