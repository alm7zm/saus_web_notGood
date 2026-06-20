import { initNav }      from './nav.js';
import { initHero }     from './hero.js';
import { initSearch }   from './search.js';
import { initLazyVideo }from './lazyVideo.js';
import { initCounters } from './counter.js';
import { initVehicle }  from './vehicle.js';
import { initBlog }     from './blog.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initSearch();
  initLazyVideo();
  initCounters();
  initVehicle();
  initBlog();

  // Auto-update footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form — mailto fallback
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data    = new FormData(form);
      const to      = form.dataset.email || '';
      const subject = encodeURIComponent(data.get('subject') || 'Website Inquiry');
      const body    = encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
      );
      if (to) window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
});
