document.addEventListener('DOMContentLoaded', async () => {
    const posts = await loadPosts();
    if (posts.length === 0) {
        document.getElementById('stats-cards').innerHTML = '<p class="text-muted">Нет данных</p>';
        return;
    }

    // Расчёт общей статистики
    let totalPercent = 0;
    let wins = 0;
    let maxProfit = -Infinity;
    let maxLoss = Infinity;
    const pairStats = {};

    posts.forEach(post => {
        const pct = calculatePercent(post);
        totalPercent += pct;
        if (pct > 0) wins++;
        if (pct > maxProfit) maxProfit = pct;
        if (pct < maxLoss) maxLoss = pct;

        if (!pairStats[post.pair]) {
            pairStats[post.pair] = { count: 0, wins: 0, totalPercent: 0 };
        }
        pairStats[post.pair].count++;
        pairStats[post.pair].totalPercent += pct;
        if (pct > 0) pairStats[post.pair].wins++;
    });

    const totalTrades = posts.length;
    const winRate = (wins / totalTrades * 100).toFixed(1);
    const avgPercent = totalPercent / totalTrades;

    // Карточки
    document.getElementById('stats-cards').innerHTML = `
        <div class="stat-card">
            <div class="label">Всего сделок</div>
            <div class="value">${totalTrades}</div>
        </div>
        <div class="stat-card">
            <div class="label">Прибыльных</div>
            <div class="value">${winRate}%</div>
        </div>
        <div class="stat-card">
            <div class="label">Суммарный %</div>
            <div class="value">${totalPercent >= 0 ? '+' : ''}${totalPercent.toFixed(2)}%</div>
        </div>
        <div class="stat-card">
            <div class="label">Средний %</div>
            <div class="value">${avgPercent >= 0 ? '+' : ''}${avgPercent.toFixed(2)}%</div>
        </div>
    `;

    // Кривая доходности (накопленный процент)
    const sorted = [...posts].sort((a,b) => new Date(a.date) - new Date(b.date));
    const cumData = [];
    let running = 0;
    sorted.forEach(p => {
        running += calculatePercent(p);
        cumData.push({ date: p.date, value: running });
    });

    new Chart(document.getElementById('equityChart'), {
        type: 'line',
        data: {
            labels: cumData.map(d => d.date),
            datasets: [{
                label: 'Накопленный %',
                data: cumData.map(d => d.value),
                borderColor: '#6fcf97',
                backgroundColor: 'rgba(111, 207, 151, 0.1)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#d0d8c0' } } },
            scales: { x: { ticks: { color: '#9aac8a' } }, y: { ticks: { color: '#9aac8a' } } }
        }
    });

    // Круговая диаграмма по парам (суммарный процент)
    const pairsForChart = Object.keys(pairStats).map(pair => ({
        pair,
        total: pairStats[pair].totalPercent
    })).filter(p => Math.abs(p.total) > 0);

    new Chart(document.getElementById('pairsChart'), {
        type: 'pie',
        data: {
            labels: pairsForChart.map(p => p.pair),
            datasets: [{
                data: pairsForChart.map(p => p.total),
                backgroundColor: ['#6fcf97', '#f28b82', '#b0c8a0', '#8a9a7a', '#5a6a4a']
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#d0d8c0' } } }
        }
    });

    // Таблица по парам
    const tbody = document.getElementById('pairs-table-body');
    Object.keys(pairStats).sort().forEach(pair => {
        const stat = pairStats[pair];
        const winratePair = stat.count ? (stat.wins / stat.count * 100).toFixed(1) : '0';
        const row = `<tr>
            <td>${pair}</td>
            <td>${stat.count}</td>
            <td>${stat.wins}</td>
            <td>${winratePair}%</td>
            <td class="${stat.totalPercent >= 0 ? 'positive' : 'negative'}">${stat.totalPercent >= 0 ? '+' : ''}${stat.totalPercent.toFixed(2)}%</td>
        </tr>`;
        tbody.innerHTML += row;
    });
});