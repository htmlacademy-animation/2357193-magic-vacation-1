import throttle from 'lodash/throttle';
import AccentTypographyBuild from './accentTypographyBuild';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.screenFill = document.querySelector(`.screen-fill`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
        this.toScreenFill();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenFill = document.querySelector(`.screen-fill`);

    this.accentTypographyRun();

    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
    });

    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  accentTypographyRun() {
    if(this.screenElements[this.activeScreen].id == 'top') {
      const animationTopScreenTextLine = new AccentTypographyBuild(`.intro__title`, `text-word--intro`);
        setTimeout(()=>{
          animationTopScreenTextLine.runAnimation();
        }, 500);
        const animationDate = new AccentTypographyBuild(`.intro__date`, `text-word`);
        setTimeout(()=>{
          animationDate.runAnimation();
        }, 1500);
    }
    else if(this.screenElements[this.activeScreen].id == 'story') {
      const animationTopScreenTextLine = new AccentTypographyBuild(`.slider__item-title`, `text-word`);
        setTimeout(()=>{
          animationTopScreenTextLine.runAnimation();
        }, 200);
    }
    else if(this.screenElements[this.activeScreen].id == 'prizes') {
      const animationTopScreenTextLine = new AccentTypographyBuild(`.prizes__title`, `text-word`);
        setTimeout(()=>{
          animationTopScreenTextLine.runAnimation();
        }, 200);
    }
    else if(this.screenElements[this.activeScreen].id == 'rules') {
      const animationTopScreenTextLine = new AccentTypographyBuild(`.rules__title`, `text-word`);
        setTimeout(()=>{
          animationTopScreenTextLine.runAnimation();
        }, 200);
    }
    else if(this.screenElements[this.activeScreen].id == 'game') {
      const animationTopScreenTextLine = new AccentTypographyBuild(`.game__title`, `text-word`);
        setTimeout(()=>{
          animationTopScreenTextLine.runAnimation();
        }, 200);
    }
  }
}
