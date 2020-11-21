import {ScreenConfig, TextConfig} from "../types";
import Text from "./text";

class Screen {

    id: string;
    name: string;
    dt: number;
    fps: number;
    type: "canvas" | "svg"
    el: HTMLCanvasElement;
    height: number;
    width: number;
    top: number;
    left: number;
    ctx: CanvasRenderingContext2D;
    svg: Element;

    objects: any[];
    startTime: number;
    frames: number;

    constructor({id, name, type, height, width}: ScreenConfig) {
        this.id = id;
        this.name = name ? name : id;
        this.dt = 0;
        this.fps = 0;
        this.type = type ? type : "canvas";
        this.height = height ? height : 300;
        this.width = width ? width : 400;
        let el = document.querySelector("#" + id);
        if (!el) {
            console.error("No element with id " + id);
            return;
        }

        if (this.type === "canvas") {
            let canvasElement = document.createElement("canvas");
            canvasElement.id = `canvas-${id}`;
            canvasElement.height = this.height;
            canvasElement.width = this.width;
            el.appendChild(canvasElement);
            this.el = canvasElement;
            let ctx = this.el.getContext("2d");
            if (!ctx) {
                console.error("Could not create canvas context");
                return;
            }
            this.ctx = ctx;
        } else if (this.type === "svg") {
            el.innerHTML = `<svg id="svg-${id}" height="${height}" width="${width}"></svg>`;
            let svg = document.querySelector(`#svg-${id}`);
            if (!svg) {
                console.error("Count not create svg element");
                return;
            }
            this.svg = svg;
        }

        this.updateBounding();

        this.objects = [];
        this.startTime = new Date().getTime();
        this.frames = 0;
    }

    updateBounding = () => {
        if (this.type === "canvas") {
            let boundingClientRect = this.el.getBoundingClientRect();
            this.top = boundingClientRect.top;
            this.left = boundingClientRect.left;
        } else if (this.type === "svg") {
            let boundingClientRect = this.svg.getBoundingClientRect();
            this.top = boundingClientRect.top;
            this.left = boundingClientRect.left;
        }
    }

    clear = () => {
        if (this.type === "canvas") {
            this.ctx.clearRect(0, 0, this.width, this.height);
        } else if (this.type === "svg") {
            // No need to clean any objects for SVG
        }
    }

    updateFrames = () => {
        let curr = new Date().getTime();
        this.dt = curr - this.startTime;
        this.fps = this.frames * 1000 / this.dt;
        if (this.dt > 1000) {
            this.startTime = curr;
            this.frames = 0;
            this.updateBounding();
        }
    }

    init = () => {
        console.error("Init is not defined");
    }

    start = () => {
        this.init();
        let textConfig: TextConfig = {
            scr: this,
            x: 10,
            y: 20,
            fontSize: "13",
            fontFamily: "Arial",
            fillColor: "#bfac9b"
        }
        this.objects.push(new Text(textConfig))
        this.startTime = new Date().getTime();
        this.frames = 0;
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.clear();
        this.frames += 1;
        this.updateFrames();

        this.objects.forEach((object) => {
            object.update();
        });
    }

}

export default Screen;