import { showScreen } from "./showScreen.js";
import { shuffle } from "./shuffle.js";


export class FourNamesQuiz {

    constructor(region, quiztype) {

        this.region = region;
        this.quiztype = quiztype;

        this.items = [];
        this.previousquestions = [];

        this.advancedrandomnesslevel = 0;

        this.score = 0;
        this.hp = 3;

        this.scorelabel = document.getElementById("score");
        this.hplabel = document.getElementById("hp");
        this.flaglabel = document.getElementById("flag");
        this.buttons = document.getElementById("answerbuttonsnames");

        this.flagImage = document.createElement("img");
        this.flagImage.alt = "Flag";

        this.flaglabel.innerHTML = "";
        this.flaglabel.appendChild(this.flagImage);
    }


    async start() {

        showScreen("fournamesquiz");

        if (this.quiztype === "countries") {

            this.items = await fetch(`options/regions/${this.region}.json`)
                .then(response => response.json());

        } else if (this.quiztype === "capitals") {

            this.items = await fetch(`options/capitals/${this.region} capitals.json`)
                .then(response => response.json());

        } else if (this.quiztype === "firstlevel") {

            this.items = await fetch(`options/firstlevel/${this.region} firstlevel.json`)
                .then(response => response.json());

        } else if (this.quiztype === "secondlevel") {

            this.items = await fetch(`options/secondlevel/${this.region} secondlevel.json`)
                .then(response => response.json());
        }

        if (this.items.length >= 100) {
            this.advancedrandomnesslevel = 3;
        } else if (this.items.length >= 50) {
            this.advancedrandomnesslevel = 2;
        } else if (this.items.length >= 30) {
            this.advancedrandomnesslevel = 1;
        } else {
            this.advancedrandomnesslevel = 0;
        }

        this.nextQuestion();
    }

    nextQuestion() {

        let correct;
        if (this.advancedrandomnesslevel === 3) {

            if (this.previousquestions.length >= Math.ceil(this.items.length * 0.75)) {
                this.previousquestions.shift();
            }

            correct = this.getRandomItem();

            while (this.previousquestions.includes(correct)) {
                correct = this.getRandomItem();
            }

            this.previousquestions.push(correct);
        }

        else if (this.advancedrandomnesslevel === 2) {

            if (this.previousquestions.length >= Math.ceil(this.items.length * 0.6)) {
                this.previousquestions.shift();
            }

            correct = this.getRandomItem();

            while (this.previousquestions.includes(correct)) {
                correct = this.getRandomItem();
            }

            this.previousquestions.push(correct);
        }

        else if (this.advancedrandomnesslevel === 1) {

            if (this.previousquestions.length >= Math.ceil(this.items.length * 0.5)) {
                this.previousquestions.shift();
            }

            correct = this.getRandomItem();
            while (this.previousquestions.includes(correct)) {
                correct = this.getRandomItem();
            }

            this.previousquestions.push(correct);
        }

        else {
            correct = this.getRandomItem();
        }

        const options = [correct];

        let count = 0;

        while (options.length < 4) {

            const candidate = this.getRandomItem();

            if (!options.includes(candidate)) {
                options.push(candidate);
            }
            count++;

            if (count > 20) {
                break;
            }
        }

        shuffle(options, correct);

        this.flagImage.src = correct.flag;
        this.flagImage.alt = correct.name;

        this.buttons.innerHTML = "";

        for (const option of options) {

            const button = document.createElement("button");

            button.className = "menu-button";
            button.textContent = option.name;

            button.addEventListener("click", () => {
                this.checkAnswer(option, correct);
            });

            this.buttons.appendChild(button);
        }
    }

    getRandomItem() {

        return this.items[
            Math.floor(Math.random() * this.items.length)
        ];
    }

    checkAnswer(option, correct) {

        if (option === correct) {

            this.score++;

            this.scorelabel.textContent = `Score: ${this.score}`;

            this.nextQuestion();

        } else {

            this.hp--;

            this.hplabel.textContent = `HP: ${this.hp}`;

            if (this.hp == 0) {

                this.deathScreen();

            }
        }
    }

    deathScreen() {

        document.getElementById("final-score").textContent =
            `Final Score: ${this.score}`;

        const backButton = document.getElementById("back-to-menu");

        backButton.onclick = () => {
            this.backToMenu();
        };

        showScreen("deathscreen");
    }

    backToMenu() {

        showScreen("main-menu");
    }
}