document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (!postId) {
        document.getElementById('post-container').innerHTML = '<p class="text-danger">ID поста не указан</p>';
        return;
    }

    const posts = await loadPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) {
        document.getElementById('post-container').innerHTML = '<p class="text-danger">Пост не найден</p>';
        return;
    }

    const percent = calculatePercent(post);
    const percentClass = percent >= 0 ? 'positive' : 'negative';
    const sign = percent >= 0 ? '+' : '';

    document.getElementById('post-container').innerHTML = `
        <h1>${post.title}</h1>
        <div class="post-meta">${post.date} · ${post.pair} · ${post.direction === 'long' ? 'Лонг' : 'Шорт'}</div>
        <div class="post-image">${post.screenshot ? '📷' : '📷'}</div>
        <div class="post-details">
            <h2 style="color: #e0e8d0; margin-bottom: 1rem;">Детали сделки</h2>
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Цена входа</div>
                    <div class="detail-value">$${post.entryPrice.toLocaleString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Цена выхода</div>
                    <div class="detail-value">$${post.exitPrice.toLocaleString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Объём</div>
                    <div class="detail-value">${post.volume} USDT</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Результат</div>
                    <div class="detail-value">
                        <span class="result-badge ${percentClass}">${sign}${percent.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="post-description">
            <h2 style="color: #e0e8d0; margin-bottom: 1rem;">Разбор сделки</h2>
            ${post.description.replace(/\n/g, '<br>')}
        </div>
    `;

    // Похожие посты (по той же паре)
    const related = posts.filter(p => p.pair === post.pair && p.id !== post.id).slice(0, 3);
    renderPosts(related, 'related-posts');
});