/* Movimiento: barra de progreso, aparición al hacer scroll, seal con paralaje. Todo se apaga con "reducir movimiento". */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (!reduce) root.classList.add('fx');

  // barra de progreso de lectura
  var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function prog() {
    var h = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
  }
  addEventListener('scroll', prog, { passive: true }); prog();

  if (reduce || !('IntersectionObserver' in window)) return;

  // aparición escalonada
  var sel = '.panel h2, .panel .label, .tl .e, .big .item, .side div, .skills > div, .cols p, .contact > *, .post h2, .post p, .post li, .post blockquote, .post .diagram, .post pre, .post .stats, .post dt, .list li';
  var els = document.querySelectorAll(sel);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { var t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(function () { t.style.transitionDelay = ''; }, 1600); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el, i) {
    el.classList.add('rv');
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = Math.min(sib, 6) * 70 + 'ms';
    io.observe(el);
  });
  setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 4000);

  // paralaje del sello
  var art = document.querySelector('.seal-art');
  if (art) {
    var mx = 0, my = 0, sy = 0, tick = false;
    addEventListener('pointermove', function (e) {
      mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); req();
    }, { passive: true });
    addEventListener('scroll', function () { sy = Math.min(scrollY, innerHeight); req(); }, { passive: true });
    function req() { if (!tick) { tick = true; requestAnimationFrame(draw); } }
    function draw() {
      tick = false;
      art.style.setProperty('--px', (mx * -26).toFixed(1) + 'px');
      art.style.setProperty('--py', (my * -20 - sy * .12).toFixed(1) + 'px');
      art.style.setProperty('--jx', (mx * 14).toFixed(1) + 'px');
      art.style.setProperty('--jy', (my * 10).toFixed(1) + 'px');
    }
  }
})();
