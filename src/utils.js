export function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    // A simple approach to center the block of text vertically
    const lines = [];
    words.forEach(word => {
        const testLine = line + word + ' ';
        if (context.measureText(testLine).width > maxWidth && line.length > 0) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });
    lines.push(line);

    // Adjust starting Y to center the text block
    currentY -= (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, index) => {
        context.fillText(line.trim(), x, currentY + index * lineHeight);
    });
}
