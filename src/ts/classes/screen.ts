import Common from "./common";
import { ScreenConfig, TextConfig } from "../types";
import Text from "./text";
import sCircle from "./circle";
import sText from "./text";
import sParticle from "./particle";
import Stats from "stats.js";

class Screen {
    id: string;
    name: string;
    dt: number;
    fps: number;
    type: "canvas" | "svg" | "webgl2"
    height: number;
    width: number;
    dev: boolean;
    gravity: number;

    screenX: number;
    screenY: number;
    stats: Stats;
    parent: Element;
    el: HTMLCanvasElement | SVGSVGElement;
    content: HTMLDivElement;
    ctx: CanvasRenderingContext2D;
    svg: SVGSVGElement;

    loaded: boolean;
    state: "neverStarted" | "paused" | "running" | "stopped" | "stateChange";
    objects: any[];
    startTime: number;
    restartTime: number;
    prevTime: number;
    prevAccTime: number;
    frames: number;
    dtAccum: number;

    constructor({id, name, type, height, width, dev, gravity}: ScreenConfig) {
        this.id = id;
        this.name = name ? name : id;
        this.dt = 0;
        this.fps = 0;
        this.type = type ? type : "canvas";
        this.height = height ? height : 300;
        this.width = width ? width : 400;
        this.dev = dev ? dev : false;
        this.gravity = gravity ? gravity : 0;

        this.loaded = false;
        let el = document.querySelector("#" + this.id);
        if (!el) {
            console.error("No element with id " + this.id);
            return;
        }
        el.innerHTML = "";
        this.parent = el;

        if (dev) {
            let menuDiv = document.createElement("div");
            menuDiv.className = "menu";
            let pauseToggleButton = document.createElement("button");
            pauseToggleButton.className = "menu-item";
            pauseToggleButton.innerHTML = "Pause / Resume";
            pauseToggleButton.onclick = this.pauseToggle;
            let stopButton = document.createElement("button");
            stopButton.className = "menu-item";
            stopButton.innerHTML = "Stop";
            stopButton.onclick = this.stop;
            let restartButton = document.createElement("button");
            restartButton.className = "menu-item";
            restartButton.innerHTML = "Restart";
            restartButton.onclick = this.restart;

            let selectLabel = document.createElement("label");
            selectLabel.className = "menu-label";
            selectLabel.htmlFor = this.id + "-menu-select";
            selectLabel.innerHTML = "Graphics type:";
            let select = document.createElement("select");
            select.id = this.id + "-menu-select";
            select.className = "menu-item";
            select.onchange = this.toggleType;
            let svgOption = document.createElement("option");
            svgOption.value = "svg";
            svgOption.innerHTML = "SVG";
            let canvasOption = document.createElement("option");
            canvasOption.value = "canvas";
            canvasOption.innerHTML = "Canvas";
            select.appendChild(svgOption);
            select.appendChild(canvasOption);
            select.value = this.type;

            // let frameLabel = document.createElement("label");
            // frameLabel.htmlFor = this.id + "-menu-frame-range";
            // frameLabel.innerHTML = "Frames:";
            // let range = document.createElement("input");
            // range.id = this.id + "-menu-frame-range";
            // range.className = "menu-item";
            // range.type = "range";
            // range.name = "frameLimit";

            menuDiv.appendChild(pauseToggleButton);
            menuDiv.appendChild(stopButton);
            menuDiv.appendChild(restartButton);
            menuDiv.appendChild(selectLabel);
            menuDiv.appendChild(select);
            // menuDiv.appendChild(frameLabel);
            // menuDiv.appendChild(range);

            this.stats = new Stats();
            this.stats.showPanel(0);
            this.stats.dom.className = "menu-align-end";
            this.stats.dom.style.position = "";
            menuDiv.appendChild(this.stats.dom);

            if (this.type === "canvas") {
                el.appendChild(menuDiv);
            } else if (this.type === "svg") {
                el.appendChild(menuDiv);
            } else if (this.type === "webgl2") {

            } else {
                console.error("Invalid type given to initialize screen");
                return;
            }
        }

        this.content = document.createElement("div");
        this.content.id = this.id + "-content";
        el.appendChild(this.content);

        this.loaded = this.load(true);

        if (this.loaded) {
            Common.screenList.push(this);
        }
    }

    private load = (firstLoad: boolean): boolean => {
        this.state = "stopped";
        this.content.innerHTML = "";
        if (this.type === "canvas") {
            let canvasElement = document.createElement("canvas");
            canvasElement.id = `${this.id}-canvas`;
            canvasElement.height = this.height;
            canvasElement.width = this.width;
            this.content.appendChild(canvasElement);
            this.el = canvasElement;
            let ctx = this.el.getContext("2d");
            if (!ctx) {
                console.error("Could not create canvas context");
                return false;
            }
            this.ctx = ctx;
        } else if (this.type === "svg") {
            let svgElement: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            svgElement.id = `${this.id}-svg`;
            svgElement.setAttributeNS(null, "height", String(this.height));
            svgElement.setAttributeNS(null, "width", String(this.width));
            this.content.appendChild(svgElement);
            this.el = svgElement;
            this.svg = svgElement;
        } else if (this.type === "webgl2") {

        } else {
            console.error("Invalid type given to initialize screen");
            return false;
        }

        this.updateBounding();

        if (firstLoad) {
            this.state = "neverStarted";
            this.objects = [];
            this.startTime = new Date().getTime();
            this.restartTime = this.startTime;
            this.prevTime = this.startTime;
            this.prevAccTime = this.startTime;
            this.frames = 0;
            this.dtAccum = 0;
        } else {
            this.state = "running";
            this.start();
        }
        return true;
    }

    private clear = () => {
        if (!this.loaded) {
            return;
        }
        if (this.type === "canvas") {
            this.ctx.clearRect(0, 0, this.width, this.height);
        } else if (this.type === "svg") {
            // No need to clean the screen for SVG
        }
    }

    init = () => {
        console.error("Init is not defined");
    }

    restart = () => {
        if (!this.loaded) {
            return;
        }
        if (this.type === "svg") {
            this.svg.innerHTML = "";
        }
        this.state = "paused";
        this.init();
        let textConfig: TextConfig = {
            scr: this,
            x: 10,
            y: 20,
            fontSize: "13",
            fontFamily: "Arial",
            fillColor: "#bfac9b"
        }
        this.objects.push(new Text(textConfig));
        this.restartTime = new Date().getTime();
        this.frames = 0;
        this.state = "running";
    }

    // @ts-ignore
    onClick = (x: number, y: number) => {
    }

    private typeTransfer = () => {
        this.state = "paused";
        let objects: any[] = [];
        this.objects.forEach((object) => {
            if (object instanceof sCircle) {
                objects.push(new sCircle({
                    ...object,
                    scr: this
                }));
            } else if (object instanceof sText) {
                objects.push(new sText({
                    ...object,
                    scr: this
                }));
            } else if (object instanceof sParticle) {
                objects.push(new sParticle({
                    ...object,
                    scr: this
                }));
            } else {
                console.error("Unrecognized object");
            }
        });
        this.objects = objects;
        let textConfig: TextConfig = {
            scr: this,
            x: 10,
            y: 20,
            fontSize: "13",
            fontFamily: "Arial",
            fillColor: "#bfac9b"
        }
        this.objects.push(new Text(textConfig))
        this.restartTime = new Date().getTime();
        this.frames = 0;
        this.state = "running";
    }

    start = () => {
        if (!this.loaded) {
            return;
        }
        if (this.state === "neverStarted") {
            this.restart();
            this.animate();
        } else {
            this.typeTransfer();
        }
    }

    stop = () => {
        if (!this.loaded) {
            return;
        }
        this.state = "stopped";
    }

    pauseToggle = () => {
        if (!this.loaded) {
            return;
        }
        if (this.state !== "stopped") {
            this.state = this.state === "running" ? "paused" : "running";
        }
    }

    toggleType = () => {
        if (!this.loaded) {
            return;
        }
        this.type = this.type === "svg" ? "canvas" : "svg";
        this.load(false);
    }

    private updateBounding = () => {
        if (this.type === "canvas") {
            let boundingClientRect = this.el.getBoundingClientRect();
            this.screenX = boundingClientRect.left;
            this.screenY = boundingClientRect.top;
        } else if (this.type === "svg") {
            let boundingClientRect = this.svg.getBoundingClientRect();
            this.screenX = boundingClientRect.left;
            this.screenY = boundingClientRect.top;
        }
    }

    private updateFrameData = () => {
        let curr = new Date().getTime();
        this.dt = curr - this.prevTime;
        this.dtAccum = curr - this.prevAccTime;
        this.fps = this.frames * 1000 / this.dtAccum;
        if (this.dtAccum > 1000) {
            this.prevAccTime = curr;
            this.frames = 0;
            this.updateBounding();
        }
        this.prevTime = curr;
    }

    private updateFrame = () => {
        if (this.state === "running") {
            this.clear();
            this.frames += 1;
            this.updateFrameData();

            this.objects.forEach((object) => {
                object.update();
            });
        }
    }

    private animate = () => {
        if (this.dev) {
            this.stats.begin();
        }
        requestAnimationFrame(this.animate);
        this.updateFrame();
        if (this.dev) {
            this.stats.end();
        }
    }

}

export default Screen;
