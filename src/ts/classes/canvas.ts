import {CanvasConfig} from "../types";

class Canvas {

    id: string;
    c: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    height: number;
    width: number;
    marginLeft: number;

    constructor({id, height, width}: CanvasConfig) {
        this.id = id;
        this.c = document.querySelector("#" + id);
        if (this.c) {
            this.height = height ? height : 300;
            this.width = width ? width : 400;
            let style = window.getComputedStyle(this.c);
            this.marginLeft = Number(style.marginLeft.slice(0, -2));
            this.c.height = this.height;
            this.c.width = this.width;
            this.ctx = this.c.getContext("2d");
        } else {
            this.ctx = null;
        }
    }

}

export default Canvas;