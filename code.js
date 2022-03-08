// variables
class whiteBoard {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 30;
        this.hue = 1;
        this.ctx.strokeStyle = `hsl(${this.hue}, 100%,65% )`;
        this.drawing = false;
        this.rainbow = {
            active: true,
            direction: true
        }
        this.lastX = 0;
        this.lastY = 0;
    }

    updateLastPos(x, y) {
        this.lastX = x;
        this.lastY = y;
    }

    draw(event) {
        if (!this.drawing) return;
        if (this.rainbow.active) this.loopColor();
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.stroke();
        [this.lastX, this.lastY] = [event.offsetX, event.offsetY];
    }

    loopColor() {
        if (this.hue >= 360 || this.hue < 0) this.rainbow.direction = !this.rainbow.direction;
        if (this.rainbow.direction) {
            this.hue++;
        } else {
            this.hue--;
        }
        this.ctx.strokeStyle = `hsl(${this.hue}, 100%,65% )`;
    }

    setColor(color) {
        switch (color) {
            case "rainbow":
                this.rainbow.active = true;
                break;
            case "red":
                this.rainbow.active = false;
                this.ctx.strokeStyle = "hsl(0, 100%,65% )"
                break;
            case "green":
                this.rainbow.active = false;
                this.ctx.strokeStyle = "hsl(120, 100%,65% )"
                break;
            case "blue":
                this.rainbow.active = false;
                this.ctx.strokeStyle = "hsl(200, 100%,65% )"
                break;
            case "black":
                this.rainbow.active = false;
                this.ctx.strokeStyle = "black"
                break;
            default:
                break;
        }
    }

    changeBrushSize(event, paragraph) {
        const value = event.path[0].value;
        this.ctx.lineWidth = value;
        brushSizeParagraph.innerText = `Brush size: ${value}px`;
    }

    clearArea() {
        this.ctx.clearRect(0, 0, 550, 550);
    }
}

const pageTitle = document.querySelector("main h1");
const buttons = document.querySelectorAll(".color-input");
const brushSizeInput = document.querySelector(".brush-size-input");
const clearButton = document.querySelector(".clear-input");
const canvas = document.querySelector(".drawing-area");
const brushSizeParagraph = document.querySelector(".settings > label > p");
const drawArea = new whiteBoard(canvas);

//setUp
brushSizeInput.addEventListener("input", event => {
    drawArea.changeBrushSize(event, brushSizeParagraph);
});


clearButton.addEventListener("click", drawArea.clearArea.bind(drawArea));
buttons.forEach(button => button.addEventListener("click", selectColor));

canvas.addEventListener("mousedown", (event) => {
    [drawArea.lastX, drawArea.lastY] = [event.offsetX, event.offsetY];
    drawArea.drawing = true;
});
canvas.addEventListener("mouseup", () => drawArea.drawing = false);
canvas.addEventListener("mouseout", () => drawArea.drawing = false);
canvas.addEventListener("mousemove", drawArea.draw.bind(drawArea));

function selectColor() {
    const colorClass = `color-input--${this.value}`;
    pageTitle.classList.forEach(cssClass => pageTitle.classList.remove(cssClass));
    pageTitle.classList.add(colorClass);

    drawArea.setColor(this.value);
}