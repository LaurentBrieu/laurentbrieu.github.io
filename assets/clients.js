document.querySelectorAll('.clients-band').forEach((band) => {
  const viewport = band.querySelector('.clients-viewport');
  const track = band.querySelector('.clients-track');
  const list = band.querySelector('.clients-list');
  const toggle = band.querySelector('.clients-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
  track.append(copy);
  let paused = reduced.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(band);
  let previous = 0;
  let position = 0;
  let holdUntil = 0;
  const update = () => {
    toggle.setAttribute('aria-label', paused ? band.dataset.play : band.dataset.pause);
    toggle.innerHTML = paused
      ? '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m5 2 9 6-9 6z"/></svg>'
      : '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2h3v12H4zm5 0h3v12H9z"/></svg>';
  };
  toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; update(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; update(); });
  band.addEventListener('mouseenter', () => { hovered = true; });
  band.addEventListener('mouseleave', () => { hovered = false; });
  band.addEventListener('focusin', () => { focused = true; });
  band.addEventListener('focusout', (event) => { focused = band.contains(event.relatedTarget); });
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((event) => {
    viewport.addEventListener(event, () => { holdUntil = performance.now() + 5000; }, { passive: true });
  });
  const frame = (now) => {
    const elapsed = previous ? Math.min(now - previous, 50) : 0;
    previous = now;
    if (visible && !paused && !hovered && !focused && !document.hidden && now > holdUntil) {
      if (Math.abs(viewport.scrollLeft - position) > 1) position = viewport.scrollLeft;
      position = (position + elapsed * .028) % list.offsetWidth;
      viewport.scrollLeft = position;
    } else { position = viewport.scrollLeft; }
    requestAnimationFrame(frame);
  };
  update();
  requestAnimationFrame(frame);
});
