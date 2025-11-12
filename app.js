// app.js — Adds page transitions and lightbox gallery
document.addEventListener('DOMContentLoaded', () => {
  // Page fade-in
  document.body.classList.add('is-loaded');

  // Fade-out when navigating internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    const isExternal = a.target === '_blank' || (href && /^(https?:)?\/\//i.test(href));
    if (!isExternal && href && !href.startsWith('#') && !a.hasAttribute('data-no-fade')) {
      e.preventDefault();
      document.body.classList.add('is-fading');
      setTimeout(() => { window.location.href = href; }, 160);
    }
  });

  // Lightbox setup
  const galleryLinks = Array.from(document.querySelectorAll('[data-lightbox="gallery"]'));
  if (galleryLinks.length) {
    let idx = 0;

    const backdrop = document.createElement('div');
    backdrop.className = 'lb-backdrop';

    const img = document.createElement('img');
    img.className = 'lb-image';

    const btnClose = document.createElement('button');
    btnClose.className = 'lb-close';
    btnClose.innerHTML = '✕';

    const btnPrev = document.createElement('button');
    btnPrev.className = 'lb-prev';
    btnPrev.innerHTML = '‹';

    const btnNext = document.createElement('button');
    btnNext.className = 'lb-next';
    btnNext.innerHTML = '›';

    backdrop.append(img, btnClose, btnPrev, btnNext);
    document.body.appendChild(backdrop);

    const openAt = (i) => {
      idx = (i + galleryLinks.length) % galleryLinks.length;
      img.src = galleryLinks[idx].getAttribute('href');
      backdrop.classList.add('is-open');
    };
    const close = () => backdrop.classList.remove('is-open');
    const prev = () => openAt(idx - 1);
    const next = () => openAt(idx + 1);

    galleryLinks.forEach((a, i) =>
      a.addEventListener('click', (e) => { e.preventDefault(); openAt(i); })
    );
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

    document.addEventListener('keydown', (e) => {
      if (!backdrop.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    let touchX = null;
    backdrop.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; });
    backdrop.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (dx > 40) prev();
      if (dx < -40) next();
      touchX = null;
    });
  }
});
