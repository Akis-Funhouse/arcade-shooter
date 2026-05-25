import Button from "./button.js";
import { Keys } from "./input.js";

export default class Menu {
  constructor(input, canvas, onStart) {
    this.input = input;
    this.canvas = canvas;
    this.onStart = onStart;

    this.state = "main"; // "main" or "controls"

    this.startButton = new Button(input, {
      text: "Start Game",
      x: canvas.width / 2 - 100,
      y: canvas.height / 2 - 80,
      width: 200,
      height: 60,
      fillColor: "#a8e61d"
    });

    this.controlsButton = new Button(input, {
      text: "Controls",
      x: canvas.width / 2 - 100,
      y: canvas.height / 2,
      width: 200,
      height: 60,
    });

    this.backButton = new Button(input, {
      text: "Back",
      x: canvas.width / 2 - 100,
      y: canvas.height / 2 + 100,
      width: 200,
      height: 60,
    });
  }

  update() {
    if (this.state === "main") {
      if (this.startButton.clicked()) {
        this.onStart();
      }

      if (this.controlsButton.clicked()) {
        this.state = "controls";
      }
    } else if (this.state === "controls") {
      if (this.backButton.clicked()) {
        this.state = "main";
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    if (this.state === "main") {
      ctx.font = "60px Arial";
      ctx.fillText("SPACE GAME", this.canvas.width / 2, 120);

      this.startButton.draw(ctx);
      this.controlsButton.draw(ctx);
    }

    if (this.state === "controls") {
      ctx.font = "40px Arial";
      ctx.fillText("CONTROLS", this.canvas.width / 2, 120);

      ctx.font = "20px Arial";
      ctx.fillText("W / S or Arrow Keys = Move", this.canvas.width / 2, 220);
      ctx.fillText("Space or D = Shoot", this.canvas.width / 2, 260);
      ctx.fillText("Shift = Dash", this.canvas.width / 2, 300);

      this.backButton.draw(ctx);
    }

    ctx.textAlign = "left";
  }
}