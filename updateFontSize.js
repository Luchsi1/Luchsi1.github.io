export function updateFontSize(element, factor = 0.03) {
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * factor;

    element.style.fontSize = `${fontSize}px`;
}