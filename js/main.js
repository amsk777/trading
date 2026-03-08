// Глобальный кэш постов
let postsCache = null;

// Загрузка постов из JSON
async function loadPosts() {
    if (postsCache) return postsCache;
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) throw new Error('Ошибка загрузки');
        postsCache = await response.json();
        return postsCache;
    } catch (e) {
        console.error('Не удалось загрузить посты', e);
        return [];
    }
}

// Расчёт результата в процентах (изменение цены)
function calculatePercent(post) {
    const entry = post.entryPrice;
    const exit = post.exitPrice;
    if (post.direction === 'long') {
        return (exit - entry) / entry * 100;
    } else {
        return (entry - exit) / entry * 100;
    }
}

// Отрисовка карточек постов
function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (posts.length === 0) {
        container.innerHTML = '<p class="text-muted">Нет постов</p>';
        return;
    }
    let html = '';
    posts.forEach(post => {
        const percent = calculatePercent(post);
        const percentClass = percent >= 0 ? 'positive' : 'negative';
        const sign = percent >= 0 ? '+' : '';
        html += `
            <div class="card">
                <div class="card-img">${post.screenshot ? '📷' : '📷'}</div>
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <div class="card-meta">${post.date} · ${post.pair} · ${post.direction === 'long' ? 'Лонг' : 'Шорт'}</div>
                    <p class="card-text">${post.description.substring(0, 80)}...</p>
                    <div class="result ${percentClass}">${sign}${percent.toFixed(2)}%</div>
                    <a href="post.html?id=${post.id}" class="btn">Подробнее</a>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}