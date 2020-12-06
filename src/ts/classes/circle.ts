import Common from "./common";
import { CircleConfig, UpdateFunction, Item } from "../types";
import Screen from "./screen";

const {color, mouse} = Common;

class sCircle extends Item<sCircle> {
    scr: Screen;
    temp: boolean;
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
    updateFunction: UpdateFunction;
    fillColor: string;
    opacity: number;

    svgCircle: SVGCircleElement;

    constructor({scr, temp, m, x, y, dx, dy, r, dr, minR, maxR, influenceR, gravity, friction, updateFunction, fillColor, opacity}: CircleConfig) {
        super();
        this.scr = scr;
        this.temp = temp ? temp : false;
        this.m = m ? m : 1;
        this.x = x ? x : 1;
        this.y = y ? y : 1;
        this.dx = dx ? dx : 0.1;
        this.dy = dy ? dy : 0.1;
        this.r = r ? r : 5;
        this.dr = dr ? dr : 2;
        this.minR = minR ? minR : this.r;
        this.maxR = maxR ? maxR : 20;
        this.influenceR = influenceR ? influenceR : 40;
        this.gravity = gravity ? gravity : 0;
        this.friction = friction ? friction : 0;
        this.updateFunction = updateFunction ? updateFunction : "random";
        this.fillColor = fillColor ? fillColor : color.pallet[Math.floor(Math.random() * (color.pallet.length))];
        this.opacity = opacity ? opacity : 1;

        if (this.scr.type === "svg" && !temp) {
            this.svgCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            this.scr.svg.appendChild(this.svgCircle);
        }
    }

    draw = () => {
        if (this.scr.type === "canvas") {
            let ctx = this.scr.ctx;
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
        } else if (this.scr.type === "svg") {
            this.svgCircle.setAttributeNS(null, "cx", String(this.x));
            this.svgCircle.setAttributeNS(null, "cy", String(this.y));
            this.svgCircle.setAttributeNS(null, "r", String(this.r));
            this.svgCircle.setAttributeNS(null, "stroke", this.fillColor);
            this.svgCircle.setAttributeNS(null, "fill", this.fillColor);
            this.svgCircle.setAttributeNS(null, "fill-opacity", String(this.opacity));
        }
    }

    move = () => {
        if (this.x > this.scr.width - this.r || this.x < this.r) {
            this.dx = -this.dx;
        }
        if (this.y > this.scr.height - this.r || this.y < this.r) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    colliding = (that: sCircle) => {
        return Math.hypot(this.x + this.dx - that.x - that.dx, this.y + this.dy - that.y - that.dy) <= this.r + that.r;
    }

    update = () => {
        if (this.updateFunction === "random") {
            this.move();

            if (mouse.x - this.scr.screenX - this.x < this.influenceR && mouse.x - this.scr.screenX - this.x > -this.influenceR &&
                mouse.y - this.scr.screenY - this.y < this.influenceR && mouse.y - this.scr.screenY - this.y > -this.influenceR &&
                this.r < this.maxR) {
                this.r += this.dr;
            } else if ((this.r - this.dr + 1) > this.minR) {
                this.r -= this.dr;
            }
        } else if (this.updateFunction === "gravity") {
            if (this.y + this.r + this.dy > this.scr.height) {
                this.dy = -this.dy * this.friction;
            } else {
                this.dy += this.gravity;
            }

            if (this.x + this.r + this.dx >= this.scr.width || this.x - this.r <= 0) {
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
            for (let i = 0; i < this.scr.objects.length; i++) {
                let obj: sCircle = this.scr.objects[i];
                if (this === obj) {
                    continue;
                }
                if (this.colliding(obj)) {
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

                    this.dx = (((m1 - m2) * u1x / (m1 + m2)) + 2 * m2 * u2x / (m1 + m2)) * 0.98;
                    this.dy = (((m1 - m2) * u1y / (m1 + m2)) + 2 * m2 * u2y / (m1 + m2)) * 0.98;

                    obj.dx = ((2 * m1 * u1x / (m1 + m2)) + (m2 - m1) * u2x / (m1 + m2)) * 0.98;
                    obj.dy = ((2 * m1 * u1y / (m1 + m2)) + (m2 - m1) * u2y / (m1 + m2)) * 0.98;
                }
            }
        } else {
            console.error("Invalid Update Function");
        }

        this.draw();
    }
}

export default sCircle;
