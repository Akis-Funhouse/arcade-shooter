/**
 * Represents a simple button for a canvas game.
 */
export default class Button {
    #isHovered = false;

    /**
     * Creates a new Button.
     * @param {Object} input - Input object with mouse information.
     * @param {Object} [options] - Configuration options for the button.
     * @param {string} [options.text="Button"] - Button text.
     * @param {number} [options.fontSize=20] - Font size for the button text.
     * @param {number} [options.x=0] - X position of the button.
     * @param {number} [options.y=0] - Y position of the button.
     * @param {number} [options.width=200] - Width of the button.
     * @param {number} [options.height=100] - Height of the button.
     * @param {string} [options.fillColor="#3498db"] - Fill color of the button.
     * @param {string} [options.hoverFillColor] - Fill color when hovered (defaults to fillColor).
     * @param {number} [options.borderSize=2] - Border thickness.
     * @param {string} [options.borderColor="#000"] - Border color.
     * @param {string} [options.hoverBorderColor] - Border color when hovered (defaults to borderColor).
     * @param {string} [options.textColor="#fff"] - Text color.
     * @param {string} [options.hoverTextColor] - Text color when hovered (defaults to textColor).
     */
    constructor(input, {
        text = "Button",
        fontSize = 20,
        x = 0,
        y = 0,
        width = 200,
        height = 100,
        fillColor = "#a8e61d",
        hoverFillColor = "#22b14c",
        borderSize = 2,
        borderColor = "#000",
        hoverBorderColor,
        textColor = "#fff",
        hoverTextColor
    } = {}) {
        this.input = input;
        this.text = text;
        this.fontSize = fontSize;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.fillColor = fillColor;
        this.hoverFillColor = hoverFillColor || fillColor;

        this.borderSize = borderSize;
        this.borderColor = borderColor;
        this.hoverBorderColor = hoverBorderColor || borderColor;

        this.textColor = textColor;
        this.hoverTextColor = hoverTextColor || textColor;
    }

    clicked() {
        this.#updateHover();
        return this.#isHovered && this.input.getMouseButtonDown('MOUSEBUTTON0');
    }
    
    draw(ctx) {
        ctx.save();
        this.#updateHover();
        ctx.fillStyle = this.#isHovered ? this.hoverFillColor : this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.borderSize > 0) {
            ctx.lineWidth = this.borderSize;
            ctx.strokeStyle = this.#isHovered ? this.hoverBorderColor : this.borderColor;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        ctx.fillStyle = this.#isHovered ? this.hoverTextColor : this.textColor;
        ctx.font = `${this.fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        ctx.restore();
    }
    
    #updateHover() {
        const mx = this.input.mousePosition.x;
        const my = this.input.mousePosition.y;
        this.#isHovered = mx >= this.x && mx <= this.x + this.width &&
                         my >= this.y && my <= this.y + this.height;
    }
}