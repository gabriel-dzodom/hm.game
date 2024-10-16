class DictionaryClass {
    #wordList = [];
    #currentIndex = 0;

    constructor() { }
    
    NewGame = () => {
        this.#loadWordList();
        if(this.#wordList.length === 0) {
            throw new Error("Dictionary was not loaded properly.");
        }
        this.#shuffleWordList();
        this.#currentIndex = 0;
    }

    #loadWordList = () => {
        this.#wordList = ["CATERPILLAR", "PHILANTHROPY"];
    }

    #shuffleWordList = () => {
        let index = this.#wordList.length,
        randomIndex;
    
        while (index != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * index);
            index--;

            // And swap it with the current element.
            [this.#wordList[index], this.#wordList[randomIndex]] = [this.#wordList[randomIndex], this.#wordList[index]];
        }    
    }

    HasNextWord = () => {
        return this.#currentIndex < this.#wordList.length;        
    }

    GetNextWord = () => {
        if (!this.HasNextWord()) {
            return null;
        }
        const word = this.#wordList[this.#currentIndex];
        this.#currentIndex++;
        return word;
    }
}

const Dictionary = new DictionaryClass();
Object.freeze(Dictionary);

export { Dictionary }