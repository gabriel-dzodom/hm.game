import { ALPHABET, BLANK_LETTER } from "./constants.js";
import { EventListener, EventManager, WordChangedEvent } from "./event.js";
import { Game } from "./hm.js";

export class UiElement {
    element = null;
    #id = "";

    constructor(tagName, id="") {
        this.element = document.createElement(tagName);
        if (id !== "") {
            this.setAttribute("id", id);
        }
    }

    setAttribute = (name, value) => {
        var attr = this.element.getAttributeNode(name);
        if (attr == null) {
            attr = document.createAttribute(name);
        }
        attr.value = value;
        this.element.setAttributeNode(attr);
    }

    Update = () => {}

    get Id() { return this.#id; }
    get HtmlElement() { return this.element; }

    get CssClass() { return this.element.getAttribute("class"); }
    set CssClass(cssClass) {
        this.setAttribute("class", cssClass);
    }

    get Style() { return this.element.getAttribute("style"); }
    set Style(style) {
        this.setAttribute("style", style)
    }

    get OnClick() { }
    set OnClick(onClickAction = null) {
        this.element.onclick = onClickAction;      
    }
}

export class LetterBox extends UiElement {
    
    #defaultClass = "letterbox";
    #state = -1;
    #onLetterChangeAction = (letter) => {}

    constructor(letter, id="") {
        super("div", id);
        this.setAttribute("tabIndex", "-1");
        this.CssClass = this.#defaultClass;
        this.#state = LetterBox.READ_ONLY;
        this.Letter = letter;
        this.element.onkeyup = this.OnKeyPressedAction;

        let listenerKey = `${LetterBox.name}-${id}`;
        EventManager.AddEventListener(
            EventManager.OnSuccessLetterGuess,
            new EventListener(listenerKey, this.OnSuccessLetterGuessAction)
        );
        EventManager.AddEventListener(
            EventManager.OnFailLetterGuess,
            new EventListener(listenerKey, this.OnFailLetterGuessAction)
        );
    }

    Select = () => {
        this.CssClass = `${this.#defaultClass} letterbox-selected`;
    }

    UnSelect = () => {
        this.CssClass = this.#defaultClass;
    }

    IsSelected = () => {
        return this.CssClass.includes("selected");
    }

    #guessAction = (state, cssClass) => {
        if (this.IsSelected()) {
            this.#state = state;
            this.UnSelect();
            this.CssClass = `${this.#defaultClass} ${cssClass}`;    
        }
    }

    OnSuccessLetterGuessAction = (e) => {
        this.#guessAction(LetterBox.GUESSED_SUCCESS, "letterbox-successguess");
    }

    OnFailLetterGuessAction = (e) => {
        this.#guessAction(LetterBox.GUESSED_FAIL, "letterbox-failguess");
    }

    OnKeyPressedAction = (e) => {
        const inputLetter = e.key.toUpperCase();
        if (this.IsSelected() && ALPHABET.includes(inputLetter) && this.Letter !== inputLetter) {
            this.Letter = inputLetter;
            this.HtmlElement;
            if(this.#onLetterChangeAction) {
                this.#onLetterChangeAction(inputLetter);
            }
        }
    }

    get Letter() { return this.element.getAttribute("value"); }
    set Letter(letter) {
        if (!letter || letter === "") {
            throw Error("Letter Box Element requires a value");
        }

        if(letter === BLANK_LETTER) {
            this.#state = LetterBox.BLANK;
        }

        this.setAttribute("value", letter);
    }

    get OnLetterChange() { return this.#onLetterChangeAction; }
    set OnLetterChange(onLetterChangeAction) {
        this.#onLetterChangeAction = onLetterChangeAction;
    }

    get State() { return this.#state; }

    static get BLANK() { return 0; }
    static get READ_ONLY() { return 1; }
    static get GUESSED_SUCCESS() { return 2; }
    static get GUESSED_FAIL() { return 3; }

    get HtmlElement() {
        const container = super.HtmlElement;
        if (container.hasChildNodes()) {
            container.removeChild(container.childNodes[0]);
        }
        var textNode = document.createTextNode(this.Letter);

        container.appendChild(textNode);
        return container;
    }

    static get 
}

export class WordBox extends UiElement {
    #playWord = null;
    #letterBoxes = [];

    constructor(playWord, id="") {
        super("div", id);
        this.Word = playWord;
        this.CssClass = "wordbox";
        EventManager.AddEventListener(
            EventManager.OnWordChanged, 
            new EventListener(WordBox.name, this.OnWordChangedAction));
    }

    OnWordChangedAction = (e) => {
        let letter = e.Letter;
        let index = e.Position;
        this.Word.SetLetter(index, letter);
        if(this.Word.Value.charAt(index) === letter) {
            Game.OnLetterGuessedAction();
            EventManager.FireEventListeners(EventManager.OnSuccessLetterGuess, e);
        } else {
            EventManager.FireEventListeners(EventManager.OnFailLetterGuess, e);
            Game.DecrementLife();
        }
    }

    #buildWordBox = () => {
        this.#letterBoxes = []; // clearing the array
        if(this.#playWord) {
            this.#playWord.Letters.forEach((letter, index) => {
                var letterBox = new LetterBox(letter, `${index}`);
                letterBox.OnClick = (e) => {
                    if (!letterBox.IsSelected() && 
                        (letterBox.State === LetterBox.BLANK || letterBox.State === LetterBox.GUESSED_FAIL)) {
                        this.#letterBoxes.forEach(lb => {
                            if (lb.IsSelected()) {
                                lb.UnSelect();
                                return;
                            }
                        });
                        letterBox.Select();
                    }
                };

                letterBox.OnLetterChange = (letter) => {
                    EventManager.FireEventListeners(EventManager.OnWordChanged, new WordChangedEvent(this, letter, index));
                };
                this.#letterBoxes.push(letterBox);
            });
        }
    }

    get HtmlElement() {
        const container = super.HtmlElement;
        for(let letterBox of this.#letterBoxes) {
            container.appendChild(letterBox.HtmlElement);
        }
        return container;
    }

    get Word() { return this.#playWord; }
    set Word(playWord) {
        this.#playWord = playWord;
        this.#buildWordBox(); 
    }

}

export class TextDisplay extends UiElement {
    #label = "";
    #value = null;

    constructor(label, value) {
        super("div");
        this.#label = label;
        this.#value = value;
    }

    get Label() { return this.#label; }
    set Label(label) { this.#label = label; }

    get Value() { return this.#value; }
    set Value(value) { this.#value = value; }

    get HtmlElement() {
        const container = super.HtmlElement;
        container.innerHTML = `<b>${this.#label}</b>: ${this.#value}`;
        return container;
    }
}

export class PointsDisplay extends TextDisplay {
    constructor() {
        super("Score", 0);
        EventManager.AddEventListener(
            EventManager.OnSuccessLetterGuess, new EventListener(PointsDisplay.name, this.OnSuccessLetterGuessAction));
    }

    OnSuccessLetterGuessAction = (e) => {
        this.Value = Game.Score;
        this.HtmlElement;
    }
}