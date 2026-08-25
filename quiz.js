import { showScreen } from "./showScreen.js";
import { shuffle } from "./shuffle.js";
import { updateFontSize } from "./updateFontSize.js";


export class Quiz {

    constructor(region, quiztype, questiontype, answertype, level, questiontypetype, answertypetype) {

        if (Quiz.activeQuiz) {
            Quiz.activeQuiz.stop();
        }

        Quiz.activeQuiz = this;
        this.active = true;
        this.gameOver = false;

        this.region = region;
        this.quiztype = quiztype;
        this.questiontype = questiontype;
        this.answertype = answertype;
        this.level = level;
        this.questiontypetype = questiontypetype;
        this.answertypetype = answertypetype

        this.items = [];
        this.previousquestions = [];

        this.advancedrandomnesslevel = 0;

        this.score = 0;
        this.hp = 3;

        this.scorelabel = document.getElementById(`score-${quiztype}`);
        this.scorelabel.textContent = `Score: ${this.score}`;
        window.addEventListener("resize", updateFontSize(this.scorelabel, 0.02))
        this.hplabel = document.getElementById(`hp-${quiztype}`);
        this.hplabel.textContent = `HP: ${this.hp}`;
        window.addEventListener("resize", updateFontSize(this.hplabel, 0.02));
        this.questionlabel = document.getElementById(`questions${quiztype}`)
        this.buttons = document.getElementById(`answerbuttons${quiztype}`)
        this.questionlabel.innerHTML = "";
        this.buttons.innerHTML = "";

        if (questiontype === "image") {
            this.questionimage = document.createElement("img");
            this.questionimage.alt = "Question";

            this.questionlabel.appendChild(this.questionimage);
        }
    }

    async start() {

        if (this.level === "countries") {

            this.items = await fetch(`options/regions/${this.region}.json`)
                .then(response => response.json());

        } else if (this.level === "capitals") {

            this.items = await fetch(`options/capitals/${this.region} capitals.json`)
                .then(response => response.json());

        } else if (this.level === "firstlevel") {

            this.items = await fetch(`options/firstlevel/${this.region} firstlevel.json`)
                .then(response => response.json());

        } else if (this.level === "secondlevel") {

            this.items = await fetch(`options/secondlevel/${this.region} secondlevel.json`)
                .then(response => response.json());
        }

        if (!this.isActive()) {
            return;
        }

        showScreen(`${this.quiztype}`);

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

        if (!this.isActive() || this.gameOver) {
            return;
        }

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

        if (this.questiontype === "image") {
            if (this.questiontypetype === "flag") {
                this.questionimage.src = correct.flag
            } else if (this.questiontypetype === "map") {
                this.questionimage.src = correct.map
            }
            this.questionimage.alt = correct.name;
        } else {
            this.questionlabel.textContent = correct.name;
        }

        this.buttons.innerHTML = "";

        if (this.answertype === "image") {
            for (const option of options) {

                const button = document.createElement("button");

                button.className = "image-answer-button";


                const image = document.createElement("img");

                image.src = option[this.answertypetype];
                image.alt = option.name;

                image.className = "answer-image";


                button.appendChild(image);


                button.addEventListener("click", () => {
                    if (option === correct) {
                        button.style.backgroundColor = "green";
                    } else {
                        button.style.backgroundColor = "red";
                    }

                    this.checkAnswer(option, correct);

                });


                this.buttons.appendChild(button);
            }
        } else {
            for (const option of options) {

                const button = document.createElement("button");

                button.className = "menu-button";
                button.textContent = option.name;

                button.addEventListener("click", () => {
                    if (option === correct) {
                        button.style.backgroundColor = "green";
                    } else {
                        button.style.backgroundColor = "red";
                    }

                    this.checkAnswer(option, correct);
                });

                this.buttons.appendChild(button);
                window.addEventListener("resize", updateFontSize(button, 0.05))
            }
        }
        
    }

    getRandomItem() {

        return this.items[
            Math.floor(Math.random() * this.items.length)
        ];
    }

    async checkAnswer(option, correct) {

        if (!this.isActive() || this.gameOver) {
            return;
        }

        if (option === correct) {

            this.score++;

            this.scorelabel.textContent = `Score: ${this.score}`;

            await new Promise(resolve => setTimeout(resolve, 200));
            this.nextQuestion();

        } else {

            this.hp = Math.max(0, this.hp - 1);

            this.hplabel.textContent = `HP: ${this.hp}`;

            if (this.hp === 0) {

                this.deathScreen();

            }
        }
    }

    deathScreen() {

        this.gameOver = true;

        document.getElementById("final-score").textContent =
            `Final Score: ${this.score}`;

        const backButton = document.getElementById("back-to-menu");

        backButton.onclick = () => {
            this.backToMenu();
        };

        showScreen("deathscreen");
    }

    backToMenu() {

        this.stop();
        showScreen("main-menu");
    }

    isActive() {

        return this.active && Quiz.activeQuiz === this;
    }

    stop() {

        this.active = false;

        if (Quiz.activeQuiz === this) {
            Quiz.activeQuiz = null;
        }
    }
}
