export default class Timer {
    constructor() {
        this.fpsInterval = 1000;
        this.now;
        this.then = Date.now();
        this.elapsed;
        this.min = 4;
        this.sec = 59;
        this.gameCounter = document.querySelector(".game__counter");
        this.idAnimationFrame = null;
    }
    
    draw() {
        if (this.sec < 10) {
            this.sec = `0${this.sec}`;
        }

        this.gameCounter.innerHTML=`<span>0${this.min}</span>:<span>${this.sec}</span>`;
        this.sec--;

        if (this.min < 0) {
            gameCounter.innerHTML=`<span>00</span>:<span>00</span>`;
            cancelAnimationFrame(this.idAnimationFrame);
        }

        if (this.sec < 0) {
            this.min--;
            this.sec= 59;
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
            this.gameCounter.innerHTML=`<span>05</span>:<span>00</span>`;
            this.min = 4;
            this.sec = 59;
        }
        requestAnimationFrame(() => this.tick());
    }

    stop() {
        cancelAnimationFrame(this.idAnimationFrame);
    }
  };
  