import {Color, Mouse} from "../types";

class Constants {

    color: Color;
    mouse: Mouse;

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

        return this;
    }
}

let constants = new Constants();

window.addEventListener('mousemove', (event) => {
    constants.mouse.x = event.x;
    constants.mouse.y = event.y;
});

export default constants;