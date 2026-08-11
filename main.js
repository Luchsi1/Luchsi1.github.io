const regions = await fetch("regions.json")
    .then(response => response.json());

const countries = await fetch("options/regions/world.json")
    .then(response => response.json());

const region = regions

const titlebutton = document.getElementById("title-button");
const currentselection = document.getElementById("current-selection");
const buttons = document.getElementById("buttons");

titlebutton.addEventListener("click", () => {
    resetRegion();
});

nextRegion(region)

function nextRegion(region) {

    const childRegions = Object.entries(region)
        .filter(([key, value]) => key !== "name" && typeof value === "object")
        .map(([key, value]) => value);
    if (childRegions.length === 0) {

        levelSelection(region.name);
        currentselection.textContent = `${region.name} - Level Selection`
        return;
    }
    
    buttons.innerHTML = "";

    for (const newRegion of Object.values(region)) {

        if (typeof newRegion !== "object") {
            continue;
        }

        const button = document.createElement("button");

        button.className = "menu-button";
        button.textContent = newRegion.name;

        button.addEventListener("click", () => {
            changeRegion(newRegion);
        });

        buttons.appendChild(button);
    }
}

function changeRegion(newRegion) {

    const currentRegion = newRegion;

    currentselection.textContent = newRegion.name;

    nextRegion(newRegion);
}

function resetRegion() {
    
    const currentRegion = regions;

    currentselection.textContent = "World";
    
    nextRegion(currentRegion);
}

function levelSelection(region) {

    buttons.innerHTML = "";

    const countriesbtn = document.createElement("button");

    countriesbtn.className = "menu-button";
    countriesbtn.textContent = "Countries";

    countriesbtn.addEventListener("click", () => {
            quizSelection(region, "countries");
        });


    const capitalsbtn = document.createElement("button");

    capitalsbtn.className = "menu-button";
    capitalsbtn.textContent = "Capitals";

    capitalsbtn.addEventListener("click", () => {
            quizSelection(region, "capitals");
        });
    

    const firstlevelbtn = document.createElement("button");

    firstlevelbtn.className = "menu-button";
    firstlevelbtn.textContent = "First-Level Subdivisions";

    firstlevelbtn.addEventListener("click", () => {
            quizSelection(region, "firstlevel");
        });


    const secondlevelbtn = document.createElement("button");

    secondlevelbtn.className = "menu-button";
    secondlevelbtn.textContent = "Second-Level Subdivisions";

    firstlevelbtn.addEventListener("click", () => {
            quizSelection(region, "secondlevel");
        });

    const regioniscountry = false
    for (const country of countries) {
        if (country.name.toLowerCase() == region.toLowerCase()) {
            const regioniscountry = True;
        }
    }
    if (regioniscountry != true) {
        buttons.appendChild(countriesbtn);
        buttons.appendChild(capitalsbtn);
    }
    buttons.appendChild(firstlevelbtn);
    buttons.appendChild(secondlevelbtn);
}

function quizSelection(region, quiztype) {

    buttons.innerHTML = "";

    const firstlevelbtn = document.createElement("button");

    firstlevelbtn.className = "menu-button";
    firstlevelbtn.textContent = "First-Level Subdivisions";

    countriesbtn.addEventListener("click", () => {
            quizSelection(region, "firstlevel");
        });

    buttons.appendChild(firstlevelbtn);
}