import Constants from "./constants";
import {CircleConfig, UpdateFunction} from "../types";
import Canvas from "./canvas";

const {color, mouse} = Constants;

class Circle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    r: number;
    dr: number;
    minR: number;
    maxR: number;
    influenceR: number;
    gravity: number;
    friction: number;
    c: Canvas;
    updateFunction: UpdateFunction;
    fillColor: string;

    constructor({canvas, x, y, dx, dy, r, dr, minR, maxR, influenceR, gravity, friction, updateFunction, fillColor}: CircleConfig) {
        this.c = canvas;

        this.x = x ? x : 1;
        this.y = y ? y : 1;
        this.dx = dx ? dx : 0.1;
        this.dy = dy ? dy : 0.1;
        this.r = r ? r : 5;
        this.dr = dr ? dr : 2;
        this.minR = minR ? minR : this.r;
        this.maxR = maxR ? maxR : 40;
        this.influenceR = influenceR ? influenceR : 40;
        this.gravity = gravity ? gravity : 0;
        this.friction = friction ? friction : 0;
        this.updateFunction = updateFunction ? updateFunction : "brownian";
        this.fillColor = fillColor ? fillColor : color.pallet[Math.floor(Math.random() * (color.pallet.length))];
    }

    draw = () => {
        let ctx = this.c.ctx!;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.closePath();
    }

    update = () => {
        if (this.updateFunction === "brownian") {
            let c = this.c.c!;
            if (this.x > c.width - this.r || this.x < this.r) {
                this.dx = -this.dx;
            }
            if (this.y > c.height - this.r || this.y < this.r) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            if (mouse.x - this.c.marginLeft - this.x < this.influenceR && mouse.x - this.c.marginLeft - this.x > -this.influenceR &&
                mouse.y - this.y < this.influenceR && mouse.y - this.y > -this.influenceR &&
                this.r < this.maxR) {
                this.r += this.dr;
            } else if ((this.r - this.dr + 1) > this.minR) {
                this.r -= this.dr;
            }
        } else if (this.updateFunction === "gravity") {
            let c = this.c.c!;
            if (this.y + this.r + this.dy > c.height) {
                this.dy = -this.dy * this.friction;
            } else {
                this.dy += this.gravity;
            }

            if (this.x + this.r + this.dx >= c.width || this.x - this.r <= 0) {
                this.dx = -this.dx;
            }

            this.dx = this.dx * 0.999;
            this.x += this.dx;
            this.y += this.dy;
        }

        this.draw();
    }
}

export default Circle;