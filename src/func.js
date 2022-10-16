export class DrawingLines {
    canvas;
    ctx;
    width;
    height;
    isLineStarted = false;
    linesArray = [];
    linesPaths = [];
    lastClickCords = [-1, -1];

    constructor() {
        this.canvas = document.getElementById("drawingCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width
        this.height = this.canvas.height
        if(!this.canvas.getContext("2d")) alert("your browser does not support canvas");
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "black";
        this.counter = 0;
    }

    // ideas
    // 1. save/restore canvas

    onLeftClick(x, y) {
        /*console.log("onLeftClick");
        console.log("x", x);
        console.log("y", y);
        console.log("this.isLineStarted", this.isLineStarted);
        console.log("this.ctx", this.ctx);
        console.log("this.lastClickCords", this.lastClickCords);
        console.log("this.linesArray", this.linesArray);*/
        if(this.isLineStarted === false) {
            this.lastClickCords = [x, y];
            this.isLineStarted = true;

        } else {
            this.drawLine(this.lastClickCords[0], this.lastClickCords[1], x, y)
            // TODO: try to collect path here and store into array to use in crossroads and maybe in collapsing
            this.linesArray.push([this.lastClickCords[0], this.lastClickCords[1], x, y]) // [[x1, y1, x2, y2], .....]

            let path = new Path2D();


            this.lastClickCords = [-1, -1];
            this.isLineStarted = false;
        }
    }

    onMouseMove(newX, newY) {
        if(!this.isLineStarted) return -1;

        this.ctx.reset();
        this.drawLineArray();
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastClickCords[0], this.lastClickCords[1]);
        this.ctx.lineTo(newX, newY);

        this.ctx.stroke();

    }

    onRightClick() {
        this.isLineStarted = false;
        this.ctx.reset();
        this.drawLineArray()
    }

    drawLine(coords) {
        this.ctx.beginPath();
        this.ctx.moveTo(coords[0], coords[1]);
        this.ctx.lineTo(coords[2], coords[3]);
        this.ctx.stroke();
    }

    drawLineArray() {


        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "black";

        for(let line of this.linesArray) {
            this.drawLine(line);
        }
    }

    checkIfLineCrossingAnotherLineAndReturnCordsIfItDoes() {
        // Нехай є пряма АБ, ми хочемо дізнатись чи є точка перетину з створенною новою прямою СД
        // 1. Визначимо чи вони перетинаються
        // 1. а. Знайдемо НЕ абсолютні відстані від А до прямої СД, від Б до прямої СД,
        // а також від С до АБ і від Д до АБ.
        // 1. б. Якщо в обох випадках знак відстаней відрізняється або хочаб одна з відстаней 0 то прямі перетинаються
        // 2. Якщо перетинаються то шукаємо точку
        // 2. а. Беремо одну з прямих, знаходимо середину.
        // 2. б. Бінарним пошуком шукаємо точку зміни знака відстані. Там насправді відстань має бути 0
        // 3. Додаємо точку в список точок
        // 4. Малюємо точку

        return false
    }

    placeRedDotOnCrossing() {

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
            this.ctx.reset();
            this.drawLineArray();
            this.counter = 0;
        }, 3000)

    }

    reduceLinesLength(lineArr, counter) {
        // smoothen animation
        if(counter < 75) counter /= 2;
        if(counter >= 75) counter *= 2;

        let multiplier = Math.round(0.001 * counter * 100) / 100;
        lineArr = lineArr.map((coords) => {
            let distX = Math.abs(coords[0] - coords[2]);
            let distY = Math.abs(coords[1] - coords[3]);

            // X
            if(coords[0] > coords[2]) {
                coords[0] -= Math.round(distX * multiplier);
                coords[2] += Math.round(distX * multiplier);
            } else {
                coords[0] += Math.round(distX * multiplier);
                coords[2] -= Math.round(distX * multiplier);
            }
            // Y
            if(coords[1] > coords[3]) {
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

