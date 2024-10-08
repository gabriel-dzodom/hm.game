import { DownloadDictionary, Game, GetNextWord, PlayWord } from "./hm.js";
import { LifeDisplay, ScoreDisplay, TextDisplay, WordBox } from "./ui.js";

var frame;
var currentWord;
var playingWord;

function InitGame() {
    frame = document.getElementById("gameFrame");
    if (frame == null) {
        throw new Error('Game Frame does not exist!');
    }

    DownloadDictionary();
    currentWord = GetNextWord()
    Game.NewGame();
    playingWord = new PlayWord(currentWord);
    const wordBox = new WordBox(playingWord); 
    const lifeCounter = new LifeDisplay();
    const points = new ScoreDisplay();
    frame.appendChild(wordBox.HtmlElement);
    frame.appendChild(lifeCounter.HtmlElement);
    frame.appendChild(points.HtmlElement);
}

InitGame();
