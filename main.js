.menu-button {
    background: rgb(26, 26, 26);

    border: 2px solid rgb(128, 128, 128);

    color: white;

    border-radius: 5px;

    cursor: pointer;
}

const regions = await fetch("regions.json")
    .then(response => response.json());

const countries = await fetch("options/regions/world.json")
    .then(response => response.json());

const region = regions

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

    currentRegion = newRegion;

    document.getElementById("current-selection").textContent =
        newRegion.name;

    nextRegion(newRegion);
}
