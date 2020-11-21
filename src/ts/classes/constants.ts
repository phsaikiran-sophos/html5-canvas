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
                'rgba(14,64,97,1)',
                'rgba(103,179,230,1)',
                'rgba(31,147,224,1)',
                'rgba(96,103,107,1)',
                'rgba(24,113,173,1)',
                'rgba(191,172,155,1)',
                'rgba(217,143,78,1)',
                'rgba(191,110,63,1)',
                'rgba(166,88,60,1)',
                'rgba(92,47,36,1)'
            ]
        };

        this.mouse = {
            x: 0,
            y: 0
        }

        this.relMouse = {
            x: 0,
            y: 0
        }

        this.scroll = {
            top: 0,
            left: 0
        }

        this.canvas = {
            height: window.innerHeight * 0.4,
            width: Math.min(window.innerWidth * 0.8, 1300)
        }
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