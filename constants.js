
class Level {
    #value;
    #name;

    constructor(value, name) {
        this.#name = name;
        this.#value = value;
    }

    get Value() {
        return this.#value;
    }

    get Name() {
        return this.#name;
    }
}

const BLANK_LETTER = "-";

const LEVEL_NORMAL = new Level(2, "NORMAL");
const LEVEL_HARD = new Level(4, "HARD");
const LEVEL_HARDER = new Level(6, "HARDER");
const LEVEL_HARDEST  = new Level(8, "HARDEST");

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export { BLANK_LETTER, LEVEL_NORMAL, LEVEL_HARD, LEVEL_HARDER, LEVEL_HARDEST, ALPHABET }