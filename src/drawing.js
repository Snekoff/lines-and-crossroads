export class Drawing {
    constructor(canvasElem) {
        this.canvas = canvasElem;
        this.ctx = this.canvas.getContext("2d");
        if (!this.canvas.getContext("2d")) console.log("your browser does not support canvas");

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.save();
    }

    drawLine(coords) {
        this.ctx.beginPath();
        this.ctx.moveTo(coords[0], coords[1]);
        this.ctx.lineTo(coords[2], coords[3]);
        this.ctx.stroke();
    }

    drawLineArray(linesArray) {
        this.ctx.reset();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.save();
        for (let line of linesArray) {
            this.drawLine(line);
        }
    }

    placeDots(dotsArray) {
        for (let dot of dotsArray) {
            this.drawCircle(dot[0], dot[1]);
        }
    }

    drawCircle(x = 0, y = 0) {
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.fillStyle = "red";
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }
}