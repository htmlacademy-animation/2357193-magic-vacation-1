export default class AccentTypographyBuild {
    constructor(
      elementSelector,
      classForAdd
    ) {
      this._TIME_SPACE = 100;
      this._classForAdd = classForAdd;
      this._elementSelector = elementSelector;
      this._classForActivate = 'active';
      this._element = document.querySelector(this._elementSelector);
      this._timeOffset = 0;
      
      this.prePareText();
    }
    
    createElement(letter) {
      const span = document.createElement(`span`);
      span.textContent = letter;
      return span;
    }
    
    prePareText() {
      if (!this._element) {
        return;
      }
      const text = this._element.textContent.trim().split(` `).filter((latter)=>latter !== '');
  
      const content = text.reduce((fragmentParent, word) => {
        const wordElement = Array.from(word).reduce((fragment, latter) => {
          fragment.appendChild(this.createElement(latter));
          return fragment;
        }, document.createDocumentFragment());
        const wordContainer = document.createElement(`span`);
        wordContainer.classList.add(this._classForAdd);
        wordContainer.appendChild(wordElement);
        fragmentParent.appendChild(wordContainer);
        return fragmentParent;
      }, document.createDocumentFragment());
  
      this._element.innerHTML = ``;
      this._element.appendChild(content);
    }
    
    runAnimation() {
      if (!this._element) {
        return;
      }
      this._element.classList.add(this._classForActivate);
    }
  
    destroyAnimation() {
      this._element.classList.remove(this._classForActivate);
    }
  }