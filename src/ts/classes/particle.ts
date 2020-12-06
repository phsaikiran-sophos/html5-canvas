import Common from "./common";
import { UpdateFunction, Item, ParticleConfig } from "../types";
import Screen from "./screen";

const {color} = Common;

class sParticle extends Item<sParticle> {
    scr: Screen;
    type: "rect" | "circle";
    m: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    scale: number;
    r: number;
    updateFunction: UpdateFunction;
    strokeColor: string;

    svgPoint: SVGRectElement | SVGCircleElement;

    constructor({scr, type, m, x, y, dx, dy, scale, updateFunction, strokeColor}: ParticleConfig) {
        super();
        this.scr = scr;
        this.type = type ? type : "rect";
        this.m = m ? m : 1;
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.dx = dx ? dx : 0.1;
        this.dy = dy ? dy : 0.1;
        this.scale = scale ? scale : 1;
        this.r = this.scale;
        this.updateFunction = updateFunction ? updateFunction : "random";
        this.strokeColor = strokeColor ? strokeColor : color.pallet[Math.floor(Math.random() * (color.pallet.length))];

        if (this.scr.type === "svg") {
            if (this.type === "rect") {
                this.svgPoint = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                this.scr.svg.appendChild(this.svgPoint);
            } else if (this.type === "circle") {
                this.svgPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                this.scr.svg.appendChild(this.svgPoint);
            } else {
                console.error("Invalid particle type");
            }
        }
    }

    draw = () => {
        if (this.scr.type === "canvas") {
            if (this.type === "rect") {
                let ctx = this.scr.ctx;
                ctx.beginPath();
                ctx.rect(this.x - this.r * 0.5, this.y - this.r * 0.5, this.r, this.r);
                ctx.strokeStyle = this.strokeColor;
                ctx.fillStyle = this.strokeColor;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            } else if (this.type === "circle") {
                let ctx = this.scr.ctx;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 0.5, 0, 2 * Math.PI, false);
                ctx.strokeStyle = this.strokeColor;
                ctx.fillStyle = this.strokeColor;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            } else {
                console.error("Invalid particle type");
            }
        } else if (this.scr.type === "svg") {
            if (this.type === "rect") {
                this.svgPoint.setAttributeNS(null, "x", String(this.x - this.r * 0.5));
                this.svgPoint.setAttributeNS(null, "y", String(this.y - this.r * 0.5));
                this.svgPoint.setAttributeNS(null, "width", String(this.r));
                this.svgPoint.setAttributeNS(null, "height", String(this.r));
                this.svgPoint.setAttributeNS(null, "stroke", this.strokeColor);
                this.svgPoint.setAttributeNS(null, "fill", this.strokeColor);
            } else if (this.type === "circle") {
                this.svgPoint.setAttributeNS(null, "cx", String(this.x));
                this.svgPoint.setAttributeNS(null, "cy", String(this.y));
                this.svgPoint.setAttributeNS(null, "r", String(this.r * 0.5));
                this.svgPoint.setAttributeNS(null, "stroke", this.strokeColor);
                this.svgPoint.setAttributeNS(null, "fill", this.strokeColor);
            } else {
                console.error("Invalid particle type");
            }
        }
    }

    colliding = (that: sParticle) => {
        return Math.hypot(this.x + this.dx - that.x - that.dx, this.y + this.dy - that.y - that.dy) <= this.r + that.r;
    }

    update = () => {
        this.draw();
    }
}

export default sParticle;
