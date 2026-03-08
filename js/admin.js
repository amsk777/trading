document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const jsonOutput = document.getElementById('json-output');

    generateBtn.addEventListener('click', () => {
        const id = document.getElementById('id').value.trim();
        const title = document.getElementById('title').value.trim();
        const date = document.getElementById('date').value;
        const pair = document.getElementById('pair').value.trim().toUpperCase();
        const direction = document.getElementById('direction').value;
        const entryPrice = parseFloat(document.getElementById('entryPrice').value);
        const exitPrice = parseFloat(document.getElementById('exitPrice').value);
        const volume = parseFloat(document.getElementById('volume').value);
        const screenshot = document.getElementById('screenshot').value.trim();
        const description = document.getElementById('description').value.trim();
        const tagsInput = document.getElementById('tags').value.trim();

        if (!id || !title || !date || !pair || isNaN(entryPrice) || isNaN(exitPrice) || isNaN(volume) || !screenshot || !description) {
            alert('Заполните все обязательные поля');
            return;
        }

        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

        const newPost = {
            id,
            title,
            date,
            pair,
            direction,
            entryPrice,
            exitPrice,
            volume,
            screenshot,
            description,
            tags
        };

        jsonOutput.value = JSON.stringify(newPost, null, 2);
    });

    copyBtn.addEventListener('click', () => {
        jsonOutput.select();
        document.execCommand('copy');
        alert('JSON скопирован');
    });
});