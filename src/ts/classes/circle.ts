import Constants from "./constants";
import {CircleConfig, UpdateFunction} from "../types";
import Canvas from "./canvas";
import Animate from "./animate";

const {color, mouse} = Constants;

class Circle {
    m: number;
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
    opacity: number;

    constructor({canvas, m, x, y, dx, dy, r, dr, minR, maxR, influenceR, gravity, friction, updateFunction, fillColor}: CircleConfig) {
        this.c = canvas;

        this.m = m ? m : 1;
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
        this.updateFunction = updateFunction ? updateFunction : "random";
        this.fillColor = fillColor ? fillColor : color.pallet[Math.floor(Math.random() * (color.pallet.length))];
        this.opacity = 0.2;
    }

    draw = () => {
        if (this.updateFunction === "collision") {
            let ctx = this.c.ctx!;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.fillColor;
            ctx.fill();
            ctx.restore();
            ctx.strokeStyle = this.fillColor;
            ctx.stroke();
            ctx.closePath();
        } else {
            let ctx = this.c.ctx!;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.fillColor;
            ctx.fill();
            ctx.closePath();
        }
    }

    move = () => {
        let c = this.c.c!;
        if (this.x > c.width - this.r || this.x < this.r) {
            this.dx = -this.dx;
        }
        if (this.y > c.height - this.r || this.y < this.r) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    update = (animate: Animate) => {
        if (this.updateFunction === "random") {
            this.move();

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
        } else if (this.updateFunction === "collision") {
            this.move();

            if (this.opacity > 0.2) {
                this.opacity -= 0.02;
            }
            for (let i = 0; i < animate.objects.length; i++) {
                let obj = animate.objects[i];
                if (this === obj) {
                    continue;
                }
                if (Math.hypot(this.x + this.dx - obj.x - obj.dx, this.y + this.dy - obj.y - obj.dy) <= this.r + obj.r) {
                    if (this.opacity < 1) {
                        this.opacity += 0.2;
                    }
                    if (obj.opacity < 1) {
                        obj.opacity += 0.2;
                    }
                    let u1x = this.dx;
                    let u1y = this.dy;
                    let u2x = obj.dx;
                    let u2y = obj.dy;
                    let m1 = this.m;
                    let m2 = obj.m;

                    this.dx = ((m1 - m2) * u1x / (m1 + m2)) + 2 * m2 * u2x / (m1 + m2);
                    this.dy = ((m1 - m2) * u1y / (m1 + m2)) + 2 * m2 * u2y / (m1 + m2);

                    obj.dx = (2 * m1 * u1x / (m1 + m2)) + (m2 - m1) * u2x / (m1 + m2);
                    obj.dy = (2 * m1 * u1y / (m1 + m2)) + (m2 - m1) * u2y / (m1 + m2);
                }
            }
        } else {
            console.error("Invalid Update Function");
        }

        this.draw();
    }
}

export default Circle;