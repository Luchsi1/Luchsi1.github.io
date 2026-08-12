import { FourNamesQuiz } from "./fournamesquiz.js";
import { showScreen } from "./showScreen.js";


export class MainMenu {

    constructor() {

        this.titlebutton = document.getElementById("title-button");
        this.currentselection = document.getElementById("current-selection");
        this.buttons = document.getElementById("buttons");

        this.regions = null;
        this.countries = null;
        this.region = null;

        this.titlebutton.addEventListener("click", () => {
            this.resetRegion();
        });
    }


    async start() {

        this.regions = await fetch("regions.json")
            .then(response => response.json());

        this.countries = await fetch("options/regions/world.json")
            .then(response => response.json());

        this.region = this.regions;

        this.currentselection.textContent = "World";

        this.nextRegion(this.region);
    }


    nextRegion(region) {

        const childRegions = Object.entries(region)
            .filter(
                ([key, value]) =>
                    key !== "name" && typeof value === "object"
            )
            .map(([key, value]) => value);

        if (childRegions.length === 0) {

            this.levelSelection(region.name);

            this.currentselection.textContent =
                `${region.name} - Level Selection`;

            return;
        }

        this.buttons.innerHTML = "";


        for (const newRegion of childRegions) {

            const button = document.createElement("button");

            button.className = "menu-button";
            button.textContent = newRegion.name;

            button.addEventListener("click", () => {
                this.changeRegion(newRegion);
            });

            this.buttons.appendChild(button);
        }
    }

    changeRegion(newRegion) {

        this.region = newRegion;

        this.currentselection.textContent =
            newRegion.name;

        this.nextRegion(newRegion);
    }

    resetRegion() {

        this.region = this.regions;

        this.currentselection.textContent = "World";

        this.nextRegion(this.region);
    }

    levelSelection(region) {

        this.buttons.innerHTML = "";


        const countriesbtn = document.createElement("button");

        countriesbtn.className = "menu-button";
        countriesbtn.textContent = "Countries";

        countriesbtn.addEventListener("click", () => {
            this.quizSelection(region, "countries");
        });


        const capitalsbtn = document.createElement("button");

        capitalsbtn.className = "menu-button";
        capitalsbtn.textContent = "Capitals";

        capitalsbtn.addEventListener("click", () => {
            this.quizSelection(region, "capitals");
        });


        const firstlevelbtn = document.createElement("button");

        firstlevelbtn.className = "menu-button";
        firstlevelbtn.textContent = "First-Level Subdivisions";

        firstlevelbtn.addEventListener("click", () => {
            this.quizSelection(region, "firstlevel");
        });


        const secondlevelbtn = document.createElement("button");

        secondlevelbtn.className = "menu-button";
        secondlevelbtn.textContent = "Second-Level Subdivisions";

        secondlevelbtn.addEventListener("click", () => {
            this.quizSelection(region, "secondlevel");
        });


        const regioniscountry = this.countries.some(country => country.name.toLowerCase() === region.toLowerCase());


        if (!regioniscountry) {

            this.buttons.appendChild(countriesbtn);
            this.buttons.appendChild(capitalsbtn);
        }


        this.buttons.appendChild(firstlevelbtn);
        this.buttons.appendChild(secondlevelbtn);
    }


    quizSelection(region, quiztype) {

        this.buttons.innerHTML = "";


        const fournamesquizbtn = document.createElement("button");

        fournamesquizbtn.className = "menu-button";
        fournamesquizbtn.textContent = "4 Names";

        fournamesquizbtn.addEventListener("click", () => {

            this.resetRegion();

            const quiz = new FourNamesQuiz(region, quiztype);

            quiz.start();
        });

        this.buttons.appendChild(fournamesquizbtn);


        const fourflagsquizbtn = document.createElement("button");

        fourflagsquizbtn.className = "menu-button";
        fourflagsquizbtn.textContent = "4 Flags";
        /*
        fourflagsquizbtn.addEventListener("click", () => {

            this.resetRegion();

            const quiz = new FourFlagsQuiz(region, quiztype);

            quiz.start();
        });
        */

        this.buttons.appendChild(fourflagsquizbtn);
    }
}