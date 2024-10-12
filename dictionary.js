class DictionaryClass {
    #wordList = ["CATERPILLAR"];
    #currentIndex = 0;

    constructor() {}
    
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