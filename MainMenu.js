import { Quiz } from "./quiz.js";
import { updateFontSize } from "./updateFontSize.js";


export class MainMenu {

    constructor() {

        this.titlebutton = document.getElementById("title-button");
        window.addEventListener("resize", updateFontSize(this.titlebutton, 0.03))
        this.currentselection = document.getElementById("current-selection");
        window.addEventListener("resize", updateFontSize(this.currentselection, 0.03))
        this.buttons = document.getElementById("buttons");

        this.regions = null;
        this.countries = null;
        this.region = null;
        this.availableFiles = null;

        this.titlebutton.addEventListener("click", () => {
            this.resetRegion();
        });
    }


    async start() {

        this.regions = await fetch("regions.json")
            .then(response => response.json());

        this.countries = await fetch("options/regions/world.json")
            .then(response => response.json());

        this.availableFiles = await fetch("options/available.json")
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
            window.addEventListener("resize", updateFontSize(button, 0.05))
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

    async fileExists(path) {
        const normalizedPath = path.toLowerCase().replace(/^options\//, "");
        const [folder, filename] = normalizedPath.split("/");
        const name = filename
            .replace(/\.json$/, "")
            .replace(/ firstlevel$/, "")
            .replace(/ secondlevel$/, "");

        return this.availableFiles[folder]?.includes(name) ?? false;
    }

    normalizeRegionName(region) {
        return String(region || "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
    }

    async levelSelection(region) {

        this.buttons.innerHTML = "";


        const countriesbtn = document.createElement("button");

        countriesbtn.className = "menu-button";
        countriesbtn.textContent = "Countries";

        countriesbtn.addEventListener("click", () => {
            this.quizSelection(region, "countries");
        });
        window.addEventListener("resize", updateFontSize(countriesbtn, 0.05));


        const firstlevelbtn = document.createElement("button");

        firstlevelbtn.className = "menu-button";
        firstlevelbtn.textContent = "First-Level Subdivisions";

        firstlevelbtn.addEventListener("click", () => {
            this.quizSelection(region, "firstlevel");
        });
        window.addEventListener("resize", updateFontSize(firstlevelbtn, 0.05));


        const secondlevelbtn = document.createElement("button");

        secondlevelbtn.className = "menu-button";
        secondlevelbtn.textContent = "Second-Level Subdivisions";

        secondlevelbtn.addEventListener("click", () => {
            this.quizSelection(region, "secondlevel");
        });
        window.addEventListener("resize", updateFontSize(secondlevelbtn, 0.05));



        const safeRegion = this.normalizeRegionName(region);

        if (await this.fileExists(`options/topotestluan/${safeRegion}.json`)) {
            await this.quizSelection(region, "topo-test luan");
            return;
        }

        if (await this.fileExists(`options/regions/${safeRegion}.json`)) {
            this.buttons.appendChild(countriesbtn);
        }

        if (await this.fileExists(`options/firstlevel/${safeRegion} firstlevel.json`)) {
            this.buttons.appendChild(firstlevelbtn);
        }

        if (await this.fileExists(`options/secondlevel/${safeRegion} secondlevel.json`)) {
            this.buttons.appendChild(secondlevelbtn);
        }

        if (this.buttons.children.length === 0) {
            this.buttons.appendChild(countriesbtn);
        }
    }


    getAvailableProperties(jsonArray) {
        if (!jsonArray || jsonArray.length === 0) return [];
        
        const firstItem = jsonArray[0];
        
        return Object.keys(firstItem);
    }

    async quizSelection(region, quiztype) {

        this.buttons.innerHTML = "";

        const safeRegion = this.normalizeRegionName(region);
        let content;

        if (quiztype === "countries") {
            content = await fetch(`options/regions/${safeRegion}.json`)
                .then(response => response.json());
            this.currentselection.textContent = `${region} - Countries - Quizselection`;
        } else if (quiztype === "firstlevel") {
            content = await fetch(`options/firstlevel/${safeRegion} firstlevel.json`)
                .then(response => response.json());
            this.currentselection.textContent = `${region} - First-Level Subdivisions - Quizselection`;
        } else if (quiztype === "secondlevel") {
            content = await fetch(`options/secondlevel/${safeRegion} secondlevel.json`)
                .then(response => response.json());
            this.currentselection.textContent = `${region} - Second-Level Subdivisions - Quizselection`;
        } else if (quiztype === "topo-test luan") {
            content = await fetch(`options/topotestluan/${safeRegion}.json`)
                .then(response => response.json());
            this.currentselection.textContent = `${region} - Topo-Test Luan - Quizselection`;
        }

        const availableProperties = this.getAvailableProperties(content);

        let quiz;


        if (availableProperties.includes("name") && availableProperties.includes("capital")) {
            const namecapitalbtn = document.createElement("button");

            namecapitalbtn.className = "menu-button";
            namecapitalbtn.textContent = "Name-Capitals";

            namecapitalbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "name-names", "name", "name", quiztype, "name", "capital", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(namecapitalbtn, 0.05));
            this.buttons.appendChild(namecapitalbtn);


            const capitalnamebtn = document.createElement("button");

            capitalnamebtn.className = "menu-button";
            capitalnamebtn.textContent = "Capital-Names";

            capitalnamebtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "name-names", "name", "name", quiztype, "capital", "name", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(capitalnamebtn, 0.05));
            this.buttons.appendChild(capitalnamebtn);
        }


        if (availableProperties.includes("name") && availableProperties.includes("flag")) {
            const nameflagbtn = document.createElement("button");

            nameflagbtn.className = "menu-button";
            nameflagbtn.textContent = "Name-Flags";

            nameflagbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "name-images", "name", "image", quiztype, "name", "flag", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(nameflagbtn, 0.05));
            this.buttons.appendChild(nameflagbtn);

            const flagnamebtn = document.createElement("button");

            flagnamebtn.className = "menu-button";
            flagnamebtn.textContent = "Flag-Names";

            flagnamebtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "image-names", "image", "name", quiztype, "flag", "name", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(flagnamebtn, 0.05));
            this.buttons.appendChild(flagnamebtn);
        }


        if (availableProperties.includes("name") && availableProperties.includes("map")) {
            const namemapbtn = document.createElement("button");

            namemapbtn.className = "menu-button";
            namemapbtn.textContent = "Name-Maps";

            namemapbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "name-images", "name", "image", quiztype, "name", "map", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(namemapbtn, 0.05));
            this.buttons.appendChild(namemapbtn);

            const mapnamebtn = document.createElement("button");

            mapnamebtn.className = "menu-button";
            mapnamebtn.textContent = "Map-Names";

            mapnamebtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "image-names", "image", "name", quiztype, "map", "name", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(mapnamebtn, 0.05));
            this.buttons.appendChild(mapnamebtn);
        }




        if (availableProperties.includes("capital") && availableProperties.includes("flag")) {
            const capitalflagbtn = document.createElement("button");

            capitalflagbtn.className = "menu-button";
            capitalflagbtn.textContent = "Capital-Flags";

            capitalflagbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "name-images", "name", "image", quiztype, "capital", "flag", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(capitalflagbtn, 0.05));
            this.buttons.appendChild(capitalflagbtn);


            const flagcapitalbtn = document.createElement("button");

            flagcapitalbtn.className = "menu-button";
            flagcapitalbtn.textContent = "Flag-Capitals";

            flagcapitalbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "image-names", "image", "name", quiztype, "flag", "capital", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(flagcapitalbtn, 0.05));
            this.buttons.appendChild(flagcapitalbtn);
        }


        if (availableProperties.includes("capital") && availableProperties.includes("map")) {
            const capitalmapbtn = document.createElement("button");

            capitalmapbtn.className = "menu-button";
            capitalmapbtn.textContent = "Capital-Maps";

            capitalmapbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "name-images", "name", "image", quiztype, "capital", "map", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(capitalmapbtn, 0.05));
            this.buttons.appendChild(capitalmapbtn);


            const mapcapitalbtn = document.createElement("button");

            mapcapitalbtn.className = "menu-button";
            mapcapitalbtn.textContent = "Map-Capitals";

            mapcapitalbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "image-names", "image", "name", quiztype, "map", "capital", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(mapcapitalbtn, 0.05));
            this.buttons.appendChild(mapcapitalbtn);
        }




        if (availableProperties.includes("flag") && availableProperties.includes("map")) {
            const flagmapbtn = document.createElement("button");

            flagmapbtn.className = "menu-button";
            flagmapbtn.textContent = "Flag-Maps";

            flagmapbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "image-images", "image", "image", quiztype, "flag", "map", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(flagmapbtn, 0.05));
            this.buttons.appendChild(flagmapbtn);


            const mapflagbtn = document.createElement("button");

            mapflagbtn.className = "menu-button";
            mapflagbtn.textContent = "Map-Flags";

            mapflagbtn.addEventListener("click", () => {
                quiz = new Quiz(safeRegion, "image-images", "image", "image", quiztype, "map", "flag", content);
                quiz.start();
                this.resetRegion();
            });
            window.addEventListener("resize", updateFontSize(mapflagbtn, 0.05));
            this.buttons.appendChild(mapflagbtn);
        }
    }
}
