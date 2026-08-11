const regions = await fetch("regions.json")
    .then(response => response.json());

const countries = await fetch("options/regions/world.json")
    .then(response => response.json());

const region = regions

const titlebutton = document.getElementById("title-button");
titlebutton.addEventListener("click", () => {
    resetRegion();
});

nextRegion(region)

function nextRegion(region) {

    const buttons = document.getElementById("buttons");
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

    document.getElementById("current-selection").textContent =
        newRegion.name;

    nextRegion(newRegion);
}

function resetRegion() {
    
    const currentRegion = regions;

    document.getElementById("current-selection").textContent = "World";
    
    nextRegion(currentRegion);
}
