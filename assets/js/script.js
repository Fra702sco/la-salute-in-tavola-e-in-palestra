document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll(
    '.reveal, .reveal-right, .reveal-left'
  );
  if (!('IntersectionObserver' in window) || reveals.length === 0) {
    reveals.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  reveals.forEach(el => observer.observe(el));
});
