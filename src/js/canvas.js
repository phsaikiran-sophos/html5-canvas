let bubblesCanvas = document.querySelector('#bubbles');
bubblesCanvas.width = window.innerWidth / 2;
bubblesCanvas.height = window.innerHeight / 2;

let c = bubblesCanvas.getContext('2d');

let mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// window.addEventListener('resize', () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     init();
// });



class Circle {
    constructor(x, y, dx, dy, radius) {
        this.maxRadius = 40;
        this.minRadius = radius;
        this.colorArray = [
            '#0E4061',
            '#67B3E6',
            '#1F93E0',
            '#60676B',
            '#1871AD',
            '#BFAC9B',
            '#D98F4E',
            '#BF6E3F',
            '#A6583C',
            '#5C2F24'
        ];

        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.dr = 2;
        this.fillStyle = this.colorArray[Math.floor(Math.random() * (this.colorArray.length))];
        this.influenceRadius = 70;
    }

    draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fillStyle = this.fillStyle;
        c.fill();
    }

    update = () => {
        if (this.x > bubblesCanvas.width - this.radius || this.x < this.radius) {
            this.dx = -this.dx;
        }
        if (this.y > bubblesCanvas.height - this.radius || this.y < this.radius) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        if (mouse.x - this.x < this.influenceRadius && mouse.x - this.x > -this.influenceRadius &&
            mouse.y - this.y < this.influenceRadius && mouse.y - this.y > -this.influenceRadius &&
            this.radius < this.maxRadius) {
            this.radius += this.dr;
        } else if ((this.radius - this.dr + 1) > this.minRadius) {
            this.radius -= this.dr;
        }

        this.draw();
    }
}

let circleArray = [];
init = () => {
    circleArray = [];
    for (let i = 0; i < 2000; i++) {
        let radius = Math.random() * 3 + 1;
        let x = Math.random() * (bubblesCanvas.width - 4 * 2) + 4;
        let y = Math.random() * (bubblesCanvas.height - 4 * 2) + 4;
        let dx = (Math.random() - 0.5) * 10;
        let dy = (Math.random() - 0.5) * 10;

        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
}

let start = new Date().getTime();
let frames = 0;
let animate = () => {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, bubblesCanvas.width, bubblesCanvas.height);
    frames += 1;

    let curr = new Date().getTime();
    c.font = "20px Arial";
    c.fillStyle = 'black';
    c.fillText((frames * 1000 / (curr - start)).toFixed(2) + " fps", 10, 30);

    circleArray.forEach((circle) => {
        circle.update();
    });

    if (curr - start > 1000) {
        start = curr;
        frames = 0;
    }
}

init();
animate();

let gravityCanvas = document.querySelector('#gravity');
gravityCanvas.width = window.innerWidth / 2;
gravityCanvas.height = window.innerHeight / 2;
let c2 = gravityCanvas.getContext('2d');

class Ball {
    constructor(x, y, dx, dy, radius) {
        this.gravity = 5;
        this.friction = 0.9;
        this.colorArray = [
            '#0E4061',
            '#67B3E6',
            '#1F93E0',
            '#60676B',
            '#1871AD',
            '#BFAC9B',
            '#D98F4E',
            '#BF6E3F',
            '#A6583C',
            '#5C2F24'
        ];

        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.fillStyle = this.colorArray[Math.floor(Math.random() * (this.colorArray.length))];
    }

    update = () => {
        // console.log([this.y, gravityCanvas.height]);
        if (this.y + this.radius + this.dy > gravityCanvas.height) {
            this.dy = -this.dy * this.friction;
        } else {
            this.dy += this.gravity;
        }

        if (this.x + this.radius + this.dx >= gravityCanvas.width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        }

        this.dx = this.dx * 0.999;
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

    draw = () => {
        c2.beginPath();
        c2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c2.fillStyle = this.fillStyle;
        c2.fill();
        c2.closePath();
    }
}

let ballArray = [];
init2 = () => {
    for (let i = 0; i < 200; i++) {
        let radius = 10 + (Math.random()) * 20;
        let x = Math.random() * (gravityCanvas.width - 30 * 2) + 30;
        let y = Math.random() * (gravityCanvas.height - 30 * 2) + 30;
        let dx = (Math.random() - 0.5) * 5;
        let dy = 10;

        ballArray.push(new Ball(x, y, dx, dy, radius));
    }
}

let start2 = new Date().getTime();
let frames2 = 0;
animate2 = () => {
    requestAnimationFrame(animate2);
    c2.clearRect(0, 0, gravityCanvas.width, gravityCanvas.height);
    frames2 += 1;

    let curr2 = new Date().getTime();
    c2.font = "20px Arial";
    c2.fillStyle = 'black';
    c2.fillText((frames2 * 1000 / (curr2 - start2)).toFixed(2) + " fps", 10, 30);

    ballArray.forEach((ball) => {
        ball.update();
    });
}

init2();
animate2();