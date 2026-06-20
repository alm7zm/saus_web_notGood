export function initHero() {
  const video = document.querySelector('.hero__video');
  if (!video) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause();
    video.removeAttribute('autoplay');
    return;
  }

  // Ensure autoplay resumes if browser paused it
  video.play().catch(() => {
    // Browser blocked autoplay — poster is already shown via CSS
  });
}
