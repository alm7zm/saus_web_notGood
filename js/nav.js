export function initNav() {
  const header   = document.querySelector('.site-header');
  const hamburger= document.querySelector('.nav__hamburger');
  const menu     = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  // Sticky scroll class
  const onScroll = () => {
    header.classList.toggle('nav--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('nav__menu--open', !expanded);
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    // Close on nav link click (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('nav__menu--open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('nav__menu--open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('nav__menu--open');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // Active link tracking via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const matches = link.getAttribute('href') === `#${id}`;
        link.setAttribute('aria-current', matches ? 'page' : 'false');
      });
    });
  }, { threshold: 0.4, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))}px 0px 0px 0px` });

  sections.forEach(s => observer.observe(s));
}
