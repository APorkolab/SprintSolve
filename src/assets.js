function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export async function loadGameAssets() {
    const [background, character, obstacle] = await Promise.all([
        loadImage('./background.png'),
        loadImage('./character.gif'),
        loadImage('./obstacle.png')
    ]);

    return { background, character, obstacle };
}
