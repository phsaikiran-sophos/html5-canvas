import {Color, Mouse} from "../types";

class Constants {

    color: Color;
    mouse: Mouse;

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