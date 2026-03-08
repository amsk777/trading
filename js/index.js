document.addEventListener('DOMContentLoaded', async () => {
    const posts = await loadPosts();
    const recent = posts.slice(-3).reverse(); // последние 3
    renderPosts(recent, 'recent-posts');
});