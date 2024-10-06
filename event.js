class Event {
    #source = null;
    constructor(source=null) {
        this.#source = source;    
    }

    get Source() { return this.#source; }
}

export class WordChangedEvent extends Event {
    #letter = "";
    #position = -1;

    constructor(source=null, letter, position) {
        super(source);
        this.#letter = letter;
        this.#position = position;
    }

    get Letter() { return this.#letter; }
    get Position() { return this.#position; }
}

export class EventListener {
    #key = "";
    #action = null;
    constructor(key, action) {
        if (key == null || key === "") {
            throw new Error("Event listener key must not be empty");
        }

        this.#key = key;
        this.#action = action;
    }

    get Key() { return this.#key; }
    get Action() { return this.#action; }
}

class EventManagerClass {
    #onWordChanged = "wordchangedevent";
    #onSuccessLetterGuess = "successletterguessevent";
    #onFailLetterGuess = "failletterguessevent";

    #eventListeners = new Map();
    constructor() {}

    AddEventListener = (eventKey, listenerObject) => {
        if (!this.#eventListeners.has(eventKey)) {
            this.#eventListeners.set(eventKey, new Map());
        }
        this.#eventListeners.get(eventKey).set(listenerObject.Key, listenerObject.Action);
    }

    RemoveEventListener = (eventKey, listenerObject) => {
        if (this.#eventListeners.has(eventKey)) {
            this.#eventListeners.get(eventKey).delete(listenerObject.Key);
        }
    }

    FireEventListeners = (eventKey, eventObject) => {
        if (this.#eventListeners.has(eventKey)) {
            this.#eventListeners.get(eventKey).forEach((listenerAction, listenerKey, map) => {
                listenerAction(eventObject);
            });
        }
    }

    get OnWordChanged() { return this.#onWordChanged; }
    get OnSuccessLetterGuess() { return this.#onSuccessLetterGuess; }
    get OnFailLetterGuess() { return this.#onFailLetterGuess; }

}

const EventManager = new EventManagerClass();
Object.freeze(EventManager);

export { EventManager }