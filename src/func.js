export class DrawingLines {
    canvas;
    ctx;
    width;
    height;
    isLineStarted = false;
    linesArray = []; // [[x1, y1, x2, y2], .....]
    dotsArray = []; // [[x1, y1], .....]
    lastClickCords = [-1, -1];

    constructor() {
        this.canvas = document.getElementById("drawingCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width
        this.height = this.canvas.height
        if (!this.canvas.getContext("2d")) alert("your browser does not support canvas");
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.counter = 0;
    }

    onLeftClick(x, y) {
        if (this.isLineStarted === false) {
            this.lastClickCords = [x, y];
            this.isLineStarted = true;

        } else {
            this.drawLine(...this.lastClickCords, x, y);
            let newLine = [...this.lastClickCords, x, y]
            let dotArr = this.searchForCrossings(newLine, this.linesArray);
            dotArr.forEach((item) => this.dotsArray.push(item));
            this.linesArray.push(newLine) // [[x1, y1, x2, y2], .....]
            this.placeDots(dotArr);

            this.lastClickCords = [-1, -1];
            this.isLineStarted = false;
        }
    }

    onMouseMove(newX, newY) {
        if (!this.isLineStarted) return -1;

        this.ctx.reset();
        this.drawLineArray();
        this.placeDots(this.dotsArray)

        this.ctx.beginPath();
        this.ctx.moveTo(...this.lastClickCords);
        this.ctx.lineTo(newX, newY);

        let newLine = [...this.lastClickCords, newX, newY]
        let dotArr = this.searchForCrossings(newLine, this.linesArray);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.placeDots(dotArr);
    }

    onRightClick() {
        this.isLineStarted = false;
        this.ctx.reset();
        this.drawLineArray()
        this.placeDots(this.dotsArray)
    }

    drawLine(coords) {
        this.ctx.restore();
        this.ctx.beginPath();
        this.ctx.moveTo(coords[0], coords[1]);
        this.ctx.lineTo(coords[2], coords[3]);
        this.ctx.stroke();
    }

    drawLineArray() {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.save();
        for (let line of this.linesArray) {
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

    searchForCrossings(currentLine, linesArr) {
        let dotsArr = []; // [[x1, y1], ....]
        for (let line of linesArr) {
            let newDot = this.searchForCrossingPointOfTwoLines(currentLine, line);
            if (this.checkIfCrossingIsInLines(currentLine, line, newDot) === true) dotsArr.push(newDot);
        }
        return dotsArr
    }

    searchForCrossingPointOfTwoLines(lineAB, lineCD) {
        let dotsX, dotsY;
        let numberX, dividerX;
        let numberY, dividerY;
        let x1 = lineAB[0], y1 = lineAB[1], x2 = lineAB[2], y2 = lineAB[3];
        let x3 = lineCD[0], y3 = lineCD[1], x4 = lineCD[2], y4 = lineCD[3];

        numberX = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)
        dividerX = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        numberY = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)
        dividerY = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

        if (dividerX === 0 || dividerY === 0) return [-1, -1];
        dotsX = numberX / dividerX;
        dotsY = numberY / dividerY;


        return [Math.round(dotsX), Math.round(dotsY)];
    }

    checkIfCrossingIsInLines(lineAB, lineCD, dot) {
        if (dot[0] === -1 && dot[1] === -1) return false;
        let x1 = lineAB[0], y1 = lineAB[1], x2 = lineAB[2], y2 = lineAB[3];
        let x3 = lineCD[0], y3 = lineCD[1], x4 = lineCD[2], y4 = lineCD[3];

        // if dot lies inside lines X
        if (((x1 >= dot[0] && dot[0] >= x2) || (x2 >= dot[0] && dot[0] >= x1)) &&
            ((x3 >= dot[0] && dot[0] >= x4) || (x4 >= dot[0] && dot[0] >= x3))) {
            // if dot lies inside lines Y
            if (((y1 >= dot[1] && dot[1] >= y2) || (y2 >= dot[1] && dot[1] >= y1)) &&
                ((y3 >= dot[1] && dot[1] >= y4) || (y4 >= dot[1] && dot[1] >= y3))) {
                return true;
            }
        }
        return false;
    }

    collapseLines() {
        let collapsingInterval = setInterval(
            () => {
                this.counter++;
                this.linesArray = this.reduceLinesLength(this.linesArray, this.counter)
                this.ctx.reset();
                this.drawLineArray();
            },
            20
        )

        setTimeout(() => {
            clearInterval(collapsingInterval);
            this.linesArray = [];
            this.dotsArray = [];
            this.ctx.reset();
            this.drawLineArray();
            this.counter = 0;
        }, 3000)
    }

    reduceLinesLength(lineArr, counter) {
        // smoothen animation
        if (counter < 75) counter /= 2;
        if (counter >= 75) counter *= 2;

        let multiplier = Math.round(0.001 * counter * 100) / 100;
        lineArr = lineArr.map((coords) => {
            let distX = Math.abs(coords[0] - coords[2]);
            let distY = Math.abs(coords[1] - coords[3]);

            // X
            if (coords[0] > coords[2]) {
                coords[0] -= Math.round(distX * multiplier);
                coords[2] += Math.round(distX * multiplier);
            } else {
                coords[0] += Math.round(distX * multiplier);
                coords[2] -= Math.round(distX * multiplier);
            }
            // Y
            if (coords[1] > coords[3]) {
                coords[1] -= Math.round(distY * multiplier);
                coords[3] += Math.round(distY * multiplier);
            } else {
                coords[1] += Math.round(distY * multiplier);
                coords[3] -= Math.round(distY * multiplier);
            }
            return coords;
        })
        return lineArr;
    }
}

