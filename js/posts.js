document.addEventListener('DOMContentLoaded', async () => {
    const allPosts = await loadPosts();

    // Заполнить фильтр по парам
    const pairSet = new Set(allPosts.map(p => p.pair));
    const pairSelect = document.getElementById('filter-pair');
    [...pairSet].sort().forEach(pair => {
        const option = document.createElement('option');
        option.value = pair;
        option.textContent = pair;
        pairSelect.appendChild(option);
    });

    const container = document.getElementById('posts-container');
    const applyBtn = document.getElementById('apply-filters');
    const filterPair = document.getElementById('filter-pair');
    const filterDirection = document.getElementById('filter-direction');
    const filterSearch = document.getElementById('filter-search');

    function filterPosts() {
        const pair = filterPair.value;
        const direction = filterDirection.value;
        const search = filterSearch.value.toLowerCase();

        const filtered = allPosts.filter(post => {
            if (pair && post.pair !== pair) return false;
            if (direction && post.direction !== direction) return false;
            if (search) {
                const titleMatch = post.title.toLowerCase().includes(search);
                const descMatch = post.description.toLowerCase().includes(search);
                return titleMatch || descMatch;
            }
            return true;
        });

        renderPosts(filtered, 'posts-container');
    }

    applyBtn.addEventListener('click', filterPosts);
    filterPosts(); // начальная загрузка
});