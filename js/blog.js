export function initBlog() {
  const filters = document.querySelectorAll('.blog__filter');
  const cards   = document.querySelectorAll('.blog-card[data-category]');

  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filters.forEach(f => {
        f.classList.remove('blog__filter--active');
        f.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('blog__filter--active');
      btn.setAttribute('aria-pressed', 'true');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  });

  // Initialize aria-pressed
  filters.forEach(f => f.setAttribute('aria-pressed', f.classList.contains('blog__filter--active') ? 'true' : 'false'));
}
