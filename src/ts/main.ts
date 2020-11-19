import Canvas from "./classes/canvas";
import Circle from "./classes/circle";
import {CircleConfig} from "./types";
import Animate from "./classes/animate";

class Main {

    constructor() {
    }

    init = () => {
        let bubbles = new Animate(new Canvas({
            id: "bubbles",
            height: window.innerHeight * 0.5,
            width: window.innerWidth * 0.7
        }));
        bubbles.init = () => {
            bubbles.objects = [];
            for (let i = 0; i < 1000; i++) {
                let config: CircleConfig = {
                    canvas: bubbles.c,
                    x: Math.random() * (bubbles.c.width - 4 * 2) + 4,
                    y: Math.random() * (bubbles.c.height - 4 * 2) + 4,
                    dx: (Math.random() - 0.5) * 10,
                    dy: (Math.random() - 0.5) * 10,
                    r: Math.random() * 3 + 1,
                    updateFunction: "brownian"
                }
                bubbles.objects.push(new Circle(config));
            }
        }
        bubbles.start();


        let gravity = new Animate(new Canvas({
            id: "gravity",
            height: window.innerHeight * 0.5,
            width: window.innerWidth * 0.7
        }));
        gravity.init = () => {
            gravity.objects = [];
            for (let i = 0; i < 100; i++) {
                let config: CircleConfig = {
                    canvas: gravity.c,
                    x: Math.random() * (gravity.c.width - 30 * 2) + 30,
                    y: Math.random() * (gravity.c.height - 30 * 2) + 30,
                    dx: (Math.random() - 0.5) * 5,
                    dy: 10,
                    r: 10 + (Math.random()) * 20,
                    gravity: 5,
                    friction: 0.9,
                    updateFunction: "gravity"
                }
                gravity.objects.push(new Circle(config));
            }
        }
        gravity.start();
    }

}

let main = new Main();
main.init()