import sCircle from "./classes/circle";
import { CircleConfig, ParticleConfig } from "./types";
import Screen from "./classes/screen";
import Common from "./classes/common";
import sParticle from "./classes/particle";

class Main {
    init = () => {
        let random = new Screen({
            id: "random",
            type: "svg",
            height: Common.canvas.height,
            width: Common.canvas.width,
            dev: true
        });
        random.init = () => {
            random.objects = [];
            for (let i = 0; i < 500; i++) {
                let config: CircleConfig = {
                    scr: random,
                    x: Math.random() * (random.width - 4 * 2) + 4,
                    y: Math.random() * (random.height - 4 * 2) + 4,
                    dx: (Math.random() - 0.5) * 10,
                    dy: (Math.random() - 0.5) * 10,
                    r: Math.random() * 3 + 1,
                    updateFunction: "random",
                    opacity: Math.max(Math.random() + 0.2, 0.8)
                }
                random.objects.push(new sCircle(config));
            }
        }
        random.start();

        let gravity = new Screen({
            id: "gravity",
            type: "svg",
            height: Common.canvas.height,
            width: Common.canvas.width,
            dev: true
        });
        gravity.init = () => {
            gravity.objects = [];
            for (let i = 0; i < 100; i++) {
                let config: CircleConfig = {
                    scr: gravity,
                    x: Math.random() * (gravity.width - 30 * 2) + 30,
                    y: Math.random() * (gravity.height - 30 * 2) + 30,
                    dx: (Math.random() - 0.5) * 5,
                    dy: 10,
                    r: 10 + (Math.random()) * 20,
                    gravity: 5,
                    friction: 0.9,
                    updateFunction: "gravity",
                    opacity: 0.8
                }
                gravity.objects.push(new sCircle(config));
            }
        }
        gravity.start();

        let collision = new Screen({
            id: "collision",
            type: "svg",
            height: Common.canvas.height,
            width: Common.canvas.width,
            dev: true
        });
        collision.init = () => {
            collision.objects = [];
            for (let i = 0; i < 100; i++) {
                let r = Math.random() * 5 + 10;
                let config: CircleConfig = {
                    scr: collision,
                    temp: true,
                    x: Math.random() * (collision.width - r * 2) + r,
                    y: Math.random() * (collision.height - r * 2) + r,
                    dx: (Math.random() - 0.5) * 20,
                    dy: (Math.random() - 0.5) * 20,
                    r: r,
                    m: Math.random() * 4 + 1,
                    updateFunction: "collision",
                    opacity: 0.2
                }
                let newCircle = new sCircle(config);

                if (i !== 0) {
                    let failSafe = 0;
                    for (let j = 0; j < collision.objects.length; j++) {
                        let obj = collision.objects[j];
                        if (obj.colliding(newCircle)) {
                            config = {
                                ...config,
                                x: Math.random() * (collision.width - r * 2) + r,
                                y: Math.random() * (collision.height - r * 2) + r,
                                dx: (Math.random() - 0.5) * 10,
                                dy: (Math.random() - 0.5) * 10,
                            }
                            newCircle = new sCircle(config);
                            j = -1;
                            failSafe += 1;
                            if (failSafe > 100) {
                                break;
                            }
                        }
                    }
                }
                config = {
                    ...config,
                    temp: false
                }
                collision.objects.push(new sCircle(config));
            }
        }
        collision.start();

        let particle = new Screen({
            id: "particle",
            type: "svg",
            height: Common.canvas.height,
            width: Common.canvas.width,
            dev: true
        });
        particle.onClick = (x: number, y: number) => {
            let scale = 10;
            let config: ParticleConfig = {
                scr: particle,
                type: "circle",
                x: x,
                y: y,
                scale: scale
            }
            particle.objects.push(new sParticle(config));
        }
        particle.init = () => {
            particle.objects = [];
        }
        particle.start();
    }
}

let main = new Main();
main.init();

// let resizeId: NodeJS.Timeout;
// window.addEventListener('resize', () => {
//     clearTimeout(resizeId);
//     resizeId = setTimeout(doneResizing, 500);
// });
//
// function doneResizing() {
//     main.init();
// }
