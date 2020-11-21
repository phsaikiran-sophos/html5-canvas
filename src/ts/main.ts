import sCircle from "./classes/circle";
import {CircleConfig} from "./types";
import Screen from "./classes/screen";
import Constants from "./classes/constants";

class Main {

    init = () => {
        let random = new Screen({
            id: "random",
            type: "svg",
            height: Constants.canvas.height,
            width: Constants.canvas.width
        });
        random.init = () => {
            random.objects = [];
            for (let i = 0; i < 600; i++) {
                let config: CircleConfig = {
                    screen: random,
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
            height: Constants.canvas.height,
            width: Constants.canvas.width
        });
        gravity.init = () => {
            gravity.objects = [];
            for (let i = 0; i < 100; i++) {
                let config: CircleConfig = {
                    screen: gravity,
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
            height: Constants.canvas.height,
            width: Constants.canvas.width
        });
        collision.init = () => {
            collision.objects = [];
            for (let i = 0; i < 100; i++) {
                let r = Math.random() * 5 + 10;
                let config: CircleConfig = {
                    screen: collision,
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

        let tbd = new Screen({
            id: "tbd",
            height: Constants.canvas.height,
            width: Constants.canvas.width
        });
        tbd.init = () => {
            tbd.objects = [];
        }
        tbd.start();
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
