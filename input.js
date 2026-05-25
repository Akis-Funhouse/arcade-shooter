export default class Input {
  #_state = new Set();
  #_previousState = new Set();
  #_toAdd = new Set();
  #_toRemove = new Set();
  #_canvas;
  #_canvasScale = 1;
  
  #_onKeyDown = (e) => {
    this.#_toAdd.add(e.key.toUpperCase());
  };

  #_onKeyUp = (e) => {
    this.#_toRemove.add(e.key.toUpperCase());
  };

  #_onMouseDown = (e) => {
    this.#_toAdd.add(this.#_getMouseButtonName(e.button));
  };

  #_onMouseUp = (e) => {
    this.#_toRemove.add(this.#_getMouseButtonName(e.button));
  };

  #_onMouseMove = (e) => {
    const rect = this.#_canvas.getBoundingClientRect();
    this.mousePosition.x = (e.clientX - rect.left) / this.#_canvasScale;
    this.mousePosition.y = (e.clientY - rect.top) / this.#_canvasScale;
  };

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.mousePosition = { x: 0, y: 0 };
    this.#_canvas = canvas;

    // No binding needed — arrow functions already capture `this`
    window.addEventListener('keydown', this.#_onKeyDown);
    window.addEventListener('keyup', this.#_onKeyUp);
    window.addEventListener('mousedown', this.#_onMouseDown);
    window.addEventListener('mouseup', this.#_onMouseUp);
    window.addEventListener('mousemove', this.#_onMouseMove);
  }

  setCanvasScale(scale) {
    this.mousePosition.x *= this.#_canvasScale;
    this.mousePosition.y *= this.#_canvasScale;
    this.#_canvasScale = scale;
    this.mousePosition.x /= this.#_canvasScale;
    this.mousePosition.y /= this.#_canvasScale;
  }

  getCanvasScale() {
    return this.#_canvasScale;
  }

  getKey(key) {
    return this.#_state.has(key);
  }

  getKeyDown(key) {
    return this.#_state.has(key) && !this.#_previousState.has(key);
  }

  getKeyUp(key) {
    return !this.#_state.has(key) && this.#_previousState.has(key);
  }

  getMouseButton(mouseButton) {
    return this.#_state.has(mouseButton);
  }

  getMouseButtonDown(mouseButton) {
    return this.#_state.has(mouseButton) && !this.#_previousState.has(mouseButton);
  }

  getMouseButtonUp(mouseButton) {
    return !this.#_state.has(mouseButton) && this.#_previousState.has(mouseButton);
  }

  update() {
    this.#_copyStateIntoPrevious();
    this.#_handleRemove();
    this.#_handleAdd();
  }

  #_getMouseButtonName(buttonIndex) {
    return `MOUSEBUTTON${buttonIndex}`;
  }

  #_copyStateIntoPrevious() {
    this.#_previousState.clear();
    for (let key of this.#_state) {
      this.#_previousState.add(key);
    }
  }

  #_handleRemove() {
    for (let key of this.#_toRemove) {
      if (!this.#_toAdd.has(key)) {
        this.#_state.delete(key);
        this.#_toRemove.delete(key);
      }
    }
  }

  #_handleAdd() {
    for (let key of this.#_toAdd) {
      this.#_state.add(key);
    }
    this.#_toAdd.clear();
  }
}

/**
 * Enum that holds mouse button name codes
 */
export const MouseButtons = {
  Left: "MOUSEBUTTON0",
  Middle: "MOUSEBUTTON1",
  Right: "MOUSEBUTTON2"
}

/**
 * Enum that holds key name codes.
 */
export const Keys = {
  Tab: 'TAB',
  Enter: 'ENTER',
  Shift: 'SHIFT',
  Control: 'CONTROL',
  Alt: 'ALT',
  Space: ' ',
  LeftArrow: 'ARROWLEFT',
  UpArrow: 'ARROWUP',
  RightArrow: 'ARROWRIGHT',
  DownArrow: 'ARROWDOWN',
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit4: '3',
  Digit3: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
  K: 'K',
  L: 'L',
  M: 'M',
  N: 'N',
  O: 'O',
  P: 'P',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  U: 'U',
  V: 'V',
  W: 'W',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
}