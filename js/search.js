const SEARCH_INDEX = [];
let focusedIdx = -1;

function buildIndex() {
  SEARCH_INDEX.length = 0;

  document.querySelectorAll('section[id]').forEach(section => {
    const id   = section.id;
    const h2   = section.querySelector('h2[id], h2');
    const name = h2 ? h2.textContent.trim() : id;

    section.querySelectorAll('h2, h3, h4').forEach(h => {
      const text = h.textContent.trim();
      if (!text) return;
      SEARCH_INDEX.push({ title: text, section: name, href: `#${id}`, type: 'heading', keywords: text.toLowerCase() });
    });

    section.querySelectorAll('p, li, td, .card__body').forEach(el => {
      const text = el.textContent.trim();
      if (text.length < 15) return;
      SEARCH_INDEX.push({
        title:    text.length > 90 ? text.slice(0, 90) + '…' : text,
        section:  name,
        href:     `#${id}`,
        type:     'content',
        keywords: text.toLowerCase()
      });
    });

    section.querySelectorAll('[data-search-content]').forEach(el => {
      const extra   = el.dataset.searchContent;
      const heading = el.querySelector('h3, h4')?.textContent.trim() ?? '';
      SEARCH_INDEX.push({
        title:    heading || extra,
        section:  name,
        href:     `#${id}`,
        type:     'feature',
        keywords: (heading + ' ' + extra).toLowerCase()
      });
    });
  });
}

function query(q) {
  if (!q || q.length < 2) return [];
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const weights = { heading: 3, feature: 2, content: 1 };

  return SEARCH_INDEX
    .filter(item => terms.every(t => item.keywords.includes(t)))
    .sort((a, b) => (weights[b.type] ?? 0) - (weights[a.type] ?? 0))
    .slice(0, 8);
}

function renderResults(results, container, status) {
  container.innerHTML = '';
  focusedIdx = -1;

  if (!results.length) {
    status.textContent = 'No results found.';
    return;
  }

  status.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found`;

  results.forEach((r, i) => {
    const el = document.createElement('a');
    el.href = r.href;
    el.className = 'search-result';
    el.setAttribute('role', 'option');
    el.setAttribute('aria-selected', 'false');
    el.innerHTML = `<span class="search-result__section">${r.section}</span><span class="search-result__title">${r.title}</span>`;
    el.addEventListener('click', closeSearch);
    el.dataset.idx = i;
    container.appendChild(el);
  });
}

function moveFocus(dir, container) {
  const results = container.querySelectorAll('.search-result');
  if (!results.length) return;
  results.forEach(r => { r.classList.remove('search-result--focused'); r.setAttribute('aria-selected', 'false'); });

  focusedIdx = (focusedIdx + dir + results.length) % results.length;
  results[focusedIdx].classList.add('search-result--focused');
  results[focusedIdx].setAttribute('aria-selected', 'true');
  results[focusedIdx].scrollIntoView({ block: 'nearest' });
}

let searchOpen = false;

function openSearch() {
  const overlay = document.getElementById('search-overlay');
  const input   = document.getElementById('search-input');
  if (!overlay || searchOpen) return;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  input.value = '';
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-status').textContent = 'Type to search…';
  input.focus();
  searchOpen = true;
  document.querySelector('.nav__search-trigger')?.setAttribute('aria-expanded', 'true');
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay || !searchOpen) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
  searchOpen = false;
  document.querySelector('.nav__search-trigger')?.setAttribute('aria-expanded', 'false');
  document.querySelector('.nav__search-trigger')?.focus();
}

function focusTrap(overlay) {
  const focusable = () => [...overlay.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')];

  overlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const els   = focusable();
    const first = els[0];
    const last  = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

export function initSearch() {
  buildIndex();

  const overlay   = document.getElementById('search-overlay');
  const input     = document.getElementById('search-input');
  const results   = document.getElementById('search-results');
  const status    = document.getElementById('search-status');
  const trigger   = document.querySelector('.nav__search-trigger');
  const closeBtn  = document.querySelector('.search-overlay__close');

  if (!overlay) return;

  focusTrap(overlay);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && searchOpen)           { e.preventDefault(); closeSearch(); }
  });

  trigger?.addEventListener('click', openSearch);
  closeBtn?.addEventListener('click', closeSearch);

  // Close on backdrop click
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });

  // Search input with debounce
  let debounceTimer;
  input?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderResults(query(input.value.trim()), results, status);
    }, 150);
  });

  // Arrow key navigation in results
  input?.addEventListener('keydown', e => {
    const res = results.querySelectorAll('.search-result');
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1, results); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1, results); }
    if (e.key === 'Enter' && focusedIdx >= 0) {
      e.preventDefault();
      res[focusedIdx]?.click();
    }
  });
}
