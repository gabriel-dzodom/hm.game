import { BLANK_LETTER, LEVEL_NORMAL } from "./constants.js";

export class PlayWord {
    #value = "";
    #letters = [];

    constructor(value) {
        this.Update(value);
    }

    Update(value) {
        this.#value = value;
        this.#letters = value.split('');
        if (!Game.Over) {
            this.#randomizeBlankLetters();
        }
    }

    Evaluate() {
        const playingValue = this.#letters.join('');
        return this.#value === playingValue;
    }

    #randomizeBlankLetters() {
        const percentToBeRemoved = 0.4 + 0.1 * Game.Level.Value;
        
        const amountToBeRemoved = Math.round(this.#letters.length * percentToBeRemoved);
        const maxIndex = this.#letters.length - 1;
        const minIndex = 0;
        const randomBucket = [];
        for(let i = 0; i < amountToBeRemoved; i++) {
            var randomIndex = 0;
            do {
                randomIndex = this.#getRandomInteger(minIndex, maxIndex);
            } while (randomBucket.includes(randomIndex));
            randomBucket.push(randomIndex);

            this.#letters[randomIndex] = BLANK_LETTER;
        }
    }

    #getRandomInteger(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);       
    }

    SetLetter(index, character) {
        if (index < 0 || index >= this.#letters.length) {
            throw new Error(`Could not set letter. Invalid index: ${index}`);
        }
        
        // if (this.#letters[index] !== BLANK_LETTER) {
        //     throw new Error(`You can only replace a blank letter.`);
        // }

        this.#letters[index] = character;
    }

    GetLetter(index) {
        if (index < 0 || index >= this.#letters.length) {
            throw new Error(`Could not get character. Invalid index: ${index}`);
        }
        return this.#letters[index];
    }

    get Value() {
        return this.#value;
    }

    get Letters() {
        return this.#letters;
    }
}

export class HmGame {
    #level = LEVEL_NORMAL;
    #soundOn = true;
    #over = true;

    #life = HmGame.MAX_LIFE;
    #score = 0;
    #wordGuessed = 0;
    #secondsElapsed = 1;
    #hints = HmGame.MAX_HINTS;

    constructor() { }

    NewGame = (level=LEVEL_NORMAL, soundOn=true) => {
        this.#level = level;
        this.#soundOn = soundOn;
        this.#over = false;

        this.#life = Math.round(HmGame.MAX_LIFE / level.Value) + 1;
        this.#hints = Math.round(HmGame.MAX_HINTS / level.Value) + 1;
    }

    OnLetterGuessedAction = () => {
        this.Score += Math.round(10.0 + (10.0 / this.Level.Value));
    }
    OnWordGuessedAction = () => {
        let wordRewards = Math.round(40.0 + (20.0 / this.Level.Value));
        let timeRewards = Math.round(10.0 * (60.0 / (this.#secondsElapsed * this.Level.Value)));
        this.Score += wordRewards + timeRewards;

        let lifeBonusThreshold = Math.round(50 * Math.pow(2, this.#wordGuessed) * this.Level.Value);
        if (this.Score >= lifeBonusThreshold) {
            this.Life++;
        }

        let hintBonusThreshold = Math.round(80 * (5 - this.Level.Value) - (5 * this.#wordGuessed));
        if (this.Hints <= hintBonusThreshold) {
            this.Hints++;
        }
        this.#wordGuessed++;
    }

    get SecondsElapsed() { return this.#secondsElapsed; }
    set SecondsElapsed(secondsElapsed) { this.#secondsElapsed = secondsElapsed; }

    get Score() { return this.#score; }
    set Score(score) { this.#score = score; }

    get Life() { return this.#life; }
    set Life(life) { this.#life = life; }

    get Hints() { return this.#hints; }
    set Hints(hints) { this.#hints = hints; }

    get SoundOn() { return this.#soundOn; }
    set SoundOn(soundOn) { this.#soundOn = soundOn; }

    get Over() { return this.#over; }
    set Over(over) { this.#over = over; }

    get Level() { return this.#level; }
    set Level(level) { this.#level = level; }


    static get MAX_LIFE() { return 8.0; }
    static get MAX_HINTS() { return 10.0; }

}

const Game = new HmGame();
Object.freeze(Game);

export { Game }
