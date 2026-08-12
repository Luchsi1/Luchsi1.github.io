export function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(
        element => element.style.display = "none"
    );

    document.getElementById(screen).style.display = "block";
}