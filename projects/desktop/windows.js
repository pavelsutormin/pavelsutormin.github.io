const windows = [];


class Window {
    constructor(x, y, width, height, html) {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
        this.html = html;
    }
}

function createWindow(window) {
    windows[windows.length] = window;
}