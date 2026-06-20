export function initLazyVideo() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const video = entry.target;

      video.querySelectorAll('source[data-src]').forEach(s => {
        s.src = s.dataset.src;
        delete s.dataset.src;
      });

      if (video.dataset.src) {
        video.src = video.dataset.src;
        delete video.dataset.src;
      }

      video.load();
      obs.unobserve(video);
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('video.lazy-video').forEach(v => observer.observe(v));
}
