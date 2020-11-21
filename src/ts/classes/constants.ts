import {Color, Mouse, Scroll} from "../types";

class Constants {
    color: Color;
    mouse: Mouse;
    relMouse: Mouse;
    scroll: Scroll;
    canvas: {
        height: number,
        width: number
    }

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
            width: Math.min(window.innerWidth * 0.8, 1300)
        };
    }
}

let constants = new Constants();

window.addEventListener('mousemove', (event) => {
    constants.relMouse.x = event.x;
    constants.relMouse.y = event.y;
    constants.mouse.x = constants.relMouse.x + constants.scroll.left;
    constants.mouse.y = constants.relMouse.y + constants.scroll.top;
});

window.addEventListener('scroll', () => {
    const html = document.querySelector('html');
    constants.scroll.left = html!.scrollLeft;
    constants.scroll.top = html!.scrollTop;
    constants.mouse.x = constants.relMouse.x + constants.scroll.left;
    constants.mouse.y = constants.relMouse.y + constants.scroll.top;
});

export default constants;