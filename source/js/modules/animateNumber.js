export default class AnimateNumber {
    constructor(fps, className, startNumber, endNumber, addNum) {
        this.fpsInterval = 1000 / fps;
        this.now;
        this.then = Date.now();
        this.elapsed;
        this.startNumber = startNumber;
        this.endNumber = endNumber;
        this.className = document.querySelector(className);
        this.addNum = addNum;
        this.idAnimationFrame = null;
    }
    
    draw() {
        this.className.innerHTML='<b>' + this.startNumber + '</b>';
        this.startNumber += this.addNum;

        if (this.startNumber >= this.endNumber) {
            this.className.innerHTML='<b>' + this.endNumber + '</b>';
            cancelAnimationFrame(this.idAnimationFrame);
        }
    }

    tick() {
        this.idAnimationFrame = requestAnimationFrame(() => this.tick());

        this.now = Date.now();
        this.elapsed = this.now - this.then;

        if (this.elapsed > this.fpsInterval) {
            // сохранение времени текущей отрисовки кадра
            this.then = this.now - (this.elapsed % this.fpsInterval);
        
            // запуск функции отрисовки
            this.draw();
        }
    }

    start () {
        if(this.idAnimationFrame) {
            cancelAnimationFrame(this.idAnimationFrame);
        }
        requestAnimationFrame(() => this.tick());
    }

    stop() {
        cancelAnimationFrame(this.idAnimationFrame);
    }
  };
  