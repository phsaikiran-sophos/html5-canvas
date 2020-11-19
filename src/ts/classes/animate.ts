import Circle from "./circle";
import Canvas from "./canvas";

class Animate {

    objects: Circle[];
    c: Canvas;
    startTime: number;
    frames: number;

    constructor(canvas: Canvas) {
        this.c = canvas;
    }

    init = () => {
        console.error("Init is not defined");
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.c.ctx!.clearRect(0, 0, this.c.width, this.c.height);
        this.frames += 1;

        let curr = new Date().getTime();
        this.c.ctx!.font = "20px Arial";
        this.c.ctx!.fillStyle = 'black';
        this.c.ctx!.fillText((this.frames * 1000 / (curr - this.startTime)).toFixed(2) + " fps", 10, 30);

        this.objects!.forEach((object) => {
            object.update();
        });

        if (curr - this.startTime > 1000) {
            this.startTime = curr;
            this.frames = 0;
        }
    }

    start = () => {
        this.init();
        this.startTime = new Date().getTime();
        this.frames = 0;
        this.animate();
    }

}

export default Animate;