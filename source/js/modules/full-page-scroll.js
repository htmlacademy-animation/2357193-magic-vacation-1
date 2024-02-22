import throttle from 'lodash/throttle';
import AccentTypographyBuild from './accentTypographyBuild';
import Timer from './timer';
import AnimateNumber from './animateNumber';

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
    this.timer = new Timer();
    this.animatePrimaryNumber = new AnimateNumber(1, ".prizes__desc--primary-number", 1, 3, 1);
    this.animateSecondaryNumber = new AnimateNumber(10, ".prizes__desc--secondary-number", 1, 7, 1);
    this.animateAdditNumber = new AnimateNumber(1000, ".prizes__desc--additional-number", 11, 900, 17);

    this.prizesDescs = document.querySelectorAll('.prizes__desc');
    this.prizesDescsText = document.querySelectorAll('.prizes__desc--text');
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

    this.prizesAnimation();

    if(this.screenElements[this.activeScreen].id == 'game') {
      this.timer.start();
    }

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
      document.body.className = "initialize";
      this.accentTypography(`.intro__title`, `text-word--intro`, 500);
      this.accentTypography(`.intro__date`, `text-word`, 1500);
    }
    else if(this.screenElements[this.activeScreen].id == 'story') {
      document.body.className = "initialize slider-change--index-1";
      this.accentTypography(`.slider__item-title`, `text-word`, 200);
    }
    else if(this.screenElements[this.activeScreen].id == 'prizes') {
      document.body.className = "initialize";
      this.accentTypography(`.prizes__title`, `text-word`, 200);
    }
    else if(this.screenElements[this.activeScreen].id == 'rules') {
      document.body.className = "initialize";
      this.accentTypography(`.rules__title`, `text-word`, 200);
    }
    else if(this.screenElements[this.activeScreen].id == 'game') {
      document.body.className = "initialize";
      this.accentTypography(`.game__title`, `text-word`, 200);
    }
  }

  accentTypography(classname1, classname2, delay) {
    const animationTopScreenTextLine = new AccentTypographyBuild(classname1, classname2);
    setTimeout(()=>{
      animationTopScreenTextLine.runAnimation();
    }, delay);
  }

  prizesAnimation() {
    if(this.screenElements[this.activeScreen].id == 'prizes') {
      let primaryAward = document.getElementById("dirigableBladesAnimate");
      primaryAward.beginElement();

      setTimeout(() => {
        this.animatePrimaryNumber.start();
        this.prizesDescs[0].classList.add('prizes__desc--animation');
        this.prizesDescsText[0].classList.add('animation-fade-in-right');
      }, 3500);

      setTimeout(() => {
        let secondaryAward = document.getElementById("cloudsFadeIn");
        secondaryAward.beginElement();
        this.animateSecondaryNumber.start();
        this.prizesDescs[1].classList.add('prizes__desc--animation');
        this.prizesDescsText[1].classList.add('animation-fade-in-right');
      }, 6000);

      setTimeout(() => {
        let additionalAward = document.getElementById("suitcaseUpFadeOut");
        additionalAward.beginElement();
        this.animateAdditNumber.start();
        this.prizesDescs[2].classList.add('prizes__desc--animation');
        this.prizesDescsText[2].classList.add('animation-fade-in-right');
      }, 10000);
    }
  }
}
