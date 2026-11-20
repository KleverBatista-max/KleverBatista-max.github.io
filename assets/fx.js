/* JK · idioma (ES/EN) + movimiento. Todo el movimiento se apaga con «reducir movimiento» del sistema. */
(function () {
  var root = document.documentElement, doc = document;
  var BASE = ((doc.currentScript && doc.currentScript.src) || '').replace(/fx\.js.*$/, '');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };
  var lang = root.classList.contains('l-en') ? 'en' : 'es';
  if (!reduce) root.classList.add('fx');

  /* ---------- idioma ---------- */
  function setLang(l, anim) {
    lang = l; root.lang = l; root.classList.remove('l-es', 'l-en'); root.classList.add('l-' + l);
    try { localStorage.setItem('lang', l); } catch (e) {}
    $$('[data-en]').forEach(function (el) {
      if (el._sc) { cancelAnimationFrame(el._sc); el.textContent = el._fin; el._sc = 0; }
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.es;
      if (el.classList.contains('glitch')) el.setAttribute('data-text', el.textContent);
      if (anim && !reduce && el.classList.contains('scramble')) scramble(el);
    });
    if (root.dataset.enTitle) { if (!root.dataset.esTitle) root.dataset.esTitle = doc.title; doc.title = l === 'en' ? root.dataset.enTitle : root.dataset.esTitle; }
    if (window.mermaid && mermaid.run) {
      var n = $$('main:not([hidden]) .mermaid:not([data-processed])').filter(function (x) { return x.offsetParent !== null; });
      if (n.length) try { mermaid.run({ nodes: n }); } catch (e) {}
    }
  }
  var lb = doc.querySelector('.lang');
  if (lb) lb.addEventListener('click', function () {
    setLang(lang === 'es' ? 'en' : 'es', true);
    if (!reduce) { lb.classList.remove('flip'); void lb.offsetWidth; lb.classList.add('flip'); flash(); }
  });
  setLang(lang, false);

  /* ---------- barra de progreso ---------- */
  var bar = doc.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); doc.body.appendChild(bar);
  function prog() { var h = root.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; }
  addEventListener('scroll', prog, { passive: true }); prog();

  if (reduce) {
    /* con «reducir movimiento»: el secreto «jk» existe, pero en versión suave (sin destello ni colores girando) */
    var cb = '';
    addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      cb = (cb + (e.key || '').toLowerCase()).slice(-2);
      if (cb !== 'jk') return; cb = '';
      for (var i = 0; i < 14; i++) (function (i) {
        setTimeout(function () {
          var s = seal('rain-calm'); s.style.left = (Math.random() * 100) + 'vw';
          s.style.setProperty('--d', (3.2 + Math.random() * 2).toFixed(2) + 's'); s.style.setProperty('--z', (.5 + Math.random() * .6).toFixed(2));
          doc.body.appendChild(s); setTimeout(s.remove.bind(s), 5600);
        }, i * 200);
      })(i);
    });
    return;
  }

  /* ---------- grano ---------- */
  var grain = doc.createElement('div'); grain.className = 'grain'; grain.setAttribute('aria-hidden', 'true'); doc.body.appendChild(grain);

  /* ---------- sello JK (para intro, clics y lluvia) ---------- */
  function seal(cls) {
    var s = doc.createElement('div'); s.className = cls; s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<img src="' + BASE + 'seal-ring.png" alt=""><img src="' + BASE + 'seal-jk.png" alt=""><i></i>';
    return s;
  }
  function flash() { var f = doc.createElement('div'); f.className = 'flash'; doc.body.appendChild(f); setTimeout(function () { f.remove(); }, 600); }

  /* ---------- intro: el sello cae y golpea (solo la primera vez en la sesión) ---------- */
  var hero = doc.getElementById('inicio'), seen = false;
  try { seen = sessionStorage.getItem('jk-intro') === '1'; sessionStorage.setItem('jk-intro', '1'); } catch (e) {}
  if (hero && !seen) {
    var intro = doc.createElement('div'); intro.className = 'intro'; intro.setAttribute('aria-hidden', 'true');
    intro.appendChild(seal('intro-seal'));
    var w = doc.createElement('div'); w.className = 'intro-word'; w.innerHTML = 'JK<i>.</i>'; intro.appendChild(w);
    for (var k = 0; k < 14; k++) { var r = doc.createElement('b'); r.className = 'ray'; r.style.setProperty('--a', (k * 360 / 14) + 'deg'); intro.appendChild(r); }
    doc.body.appendChild(intro); root.classList.add('intro-on');
    var end = function () { if (!intro.parentNode) return; intro.classList.add('out'); root.classList.remove('intro-on'); setTimeout(function () { intro.remove(); }, 700); };
    setTimeout(function () { doc.body.classList.add('shake'); setTimeout(function () { doc.body.classList.remove('shake'); }, 450); }, 520);
    setTimeout(end, 1500); intro.addEventListener('click', end);
  }

  /* ---------- texto que se descifra ---------- */
  var GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+<>/=_01JK✦';
  function scramble(el) {
    var fin = el._sc ? el._fin : el.textContent; if (el._sc) cancelAnimationFrame(el._sc); el._fin = fin;
    var t0 = performance.now(), dur = 650 + fin.length * 18;
    clearTimeout(el._st); el._st = setTimeout(function () { if (el._sc) cancelAnimationFrame(el._sc); el._sc = 0; el.textContent = fin; }, dur + 120);
    (function f(t) {
      var p = Math.min(1, (t - t0) / dur), n = Math.floor(p * fin.length), s = fin.slice(0, n);
      for (var i = n; i < fin.length; i++) s += fin[i] === ' ' ? ' ' : GL[(Math.random() * GL.length) | 0];
      el.textContent = s;
      if (p < 1) el._sc = requestAnimationFrame(f); else { el.textContent = fin; el._sc = 0; }
    })(t0);
  }
  $$('.scramble').forEach(function (el) { if (fine) el.addEventListener('mouseenter', function () { scramble(el); }); });

  /* ---------- contadores ---------- */
  function count(el) {
    var a = +el.dataset.from || 0, b = +el.dataset.to, t0 = performance.now(), d = 1500;
    (function f(t) { var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(2, -10 * p); el.textContent = Math.round(a + (b - a) * (p === 1 ? 1 : e)); if (p < 1) requestAnimationFrame(f); })(t0);
  }

  /* ---------- aparición al hacer scroll ---------- */
  if ('IntersectionObserver' in window) {
    var sel = '.panel h2, .panel .label, .tl .e, .big .item, .side div, .skills > div, .cols p, .contact > *, .post h2, .post p, .post li, .post blockquote, .post .diagram, .post pre, .post .stats, .post dt, .list li';
    var els = $$(sel);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; t.classList.add('in'); io.unobserve(t);
        if (t.classList.contains('scramble')) scramble(t);
        setTimeout(function () { t.style.transitionDelay = ''; }, 1600);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) {
      el.classList.add('rv');
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(sib, 6) * 70 + 'ms';
      io.observe(el);
    });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 4000);
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); io2.unobserve(e.target); } }); }, { threshold: .6 });
    $$('.count, .stat b').forEach(function (el) {
      if (!el.dataset.to) { var v = parseInt(el.textContent, 10); if (isNaN(v) || String(v) !== el.textContent.trim()) return; el.dataset.to = v; el.dataset.from = 0; }
      io2.observe(el);
    });
    var hb = doc.querySelector('#inicio h1 .scramble'); if (hb) setTimeout(function () { scramble(hb); }, seen ? 300 : 1500);
  }

  /* ---------- velocidad del scroll: inclina, acelera el sello y la cinta ---------- */
  var lastY = scrollY, vel = 0, ang = 0;
  var ring = doc.querySelector('.seal-ring'), art = doc.querySelector('.seal-art');
  var tracks = [].slice.call(doc.querySelectorAll('.marquee .track')), TD = [-1, 1, -1], TS = [1.1, 0.8, 1.5];
  var tm = tracks.map(function () { return { x: 0, half: 0 }; });
  function measure() { tracks.forEach(function (t, i) { tm[i].half = t.scrollWidth / 3; if (TD[i] > 0 && tm[i].x === 0) tm[i].x = -tm[i].half; }); }
  tracks.forEach(function (t) { t.innerHTML += t.innerHTML + t.innerHTML; });
  measure(); addEventListener('resize', measure);
  var px = 0, py = 0, tx = 0, ty = 0;
  addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  (function loop() {
    var y = scrollY, d = y - lastY; lastY = y;
    vel += (d - vel) * .18;
    var sk = Math.max(-4, Math.min(4, vel * .12));
    if (ring) { ang += .06 + Math.abs(vel) * .35; ring.style.transform = 'rotate(' + ang.toFixed(2) + 'deg)'; }
    px += (tx - px) * .08; py += (ty - py) * .08;
    if (art) {
      var sy = Math.min(y, innerHeight);
      art.style.setProperty('--px', (px * -40).toFixed(1) + 'px'); art.style.setProperty('--py', (py * -30 - sy * .18).toFixed(1) + 'px');
      art.style.setProperty('--jx', (px * 26).toFixed(1) + 'px'); art.style.setProperty('--jy', (py * 18).toFixed(1) + 'px');
    }
    tracks.forEach(function (t, i) { var m = tm[i]; if (!m.half) return; var dir = TD[i % TD.length], sp = (TS[i % TS.length] + Math.abs(vel) * .6) * dir; m.x += sp; if (dir < 0 && m.x <= -m.half) m.x += m.half; if (dir > 0 && m.x >= 0) m.x -= m.half; t.style.transform = 'translateX(' + m.x.toFixed(1) + 'px)'; });
    requestAnimationFrame(loop);
  })();

  /* ---------- cursor propio, imanes, inclinación y foco de luz (solo con mouse) ---------- */
  if (fine) {
    var dot = doc.createElement('div'), cr = doc.createElement('div'); dot.className = 'cur-dot'; cr.className = 'cur-ring';
    cr.innerHTML = '<span></span>'; doc.body.appendChild(dot); doc.body.appendChild(cr); root.classList.add('has-cur');
    var cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
    addEventListener('pointermove', function (e) { cx = e.clientX; cy = e.clientY; dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; }, { passive: true });
    (function cl() { rx += (cx - rx) * .16; ry += (cy - ry) * .16; cr.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)'; requestAnimationFrame(cl); })();
    doc.addEventListener('pointerover', function (e) {
      var a = e.target.closest && e.target.closest('a, button, .item, .tilt');
      cr.classList.toggle('big', !!a);
      var it = e.target.closest && e.target.closest('.big .item');
      cr.classList.toggle('lbl', !!it); cr.firstChild.textContent = it ? (lang === 'en' ? 'read →' : 'leer →') : '';
    });
    addEventListener('pointerdown', function () { cr.classList.add('down'); });
    addEventListener('pointerup', function () { cr.classList.remove('down'); });
    doc.addEventListener('mouseleave', function () { root.classList.add('cur-out'); });
    doc.addEventListener('mouseenter', function () { root.classList.remove('cur-out'); });

    $$('.mag, .brand, .lang').forEach(function (el) {
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .35).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .45).toFixed(1) + 'px)'; });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    $$('.tilt, .stat').forEach(function (el) {
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = 'perspective(700px) rotateY(' + (x * 18).toFixed(1) + 'deg) rotateX(' + (-y * 18).toFixed(1) + 'deg) scale(1.04)'; el.style.setProperty('--gx', (x + .5) * 100 + '%'); el.style.setProperty('--gy', (y + .5) * 100 + '%'); });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    $$('.panel').forEach(function (p) {
      p.addEventListener('pointermove', function (e) { var r = p.getBoundingClientRect(); p.style.setProperty('--mx', (e.clientX - r.left) + 'px'); p.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    });
  }

  /* ---------- clic donde sea: sello JK ---------- */
  var stamps = [];
  function stamp(x, y, big) {
    var s = seal('stamp' + (big ? ' big' : '')); s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.setProperty('--r', ((Math.random() * 50) - 25).toFixed(0) + 'deg');
    doc.body.appendChild(s); stamps.push(s);
    for (var i = 0; i < 10; i++) {
      var p = doc.createElement('b'); p.className = 'ink'; p.style.left = x + 'px'; p.style.top = y + 'px';
      var a = Math.random() * 6.283, d = 40 + Math.random() * 70; p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); p.style.setProperty('--dy', (Math.sin(a) * d).toFixed(0) + 'px');
      doc.body.appendChild(p); setTimeout(p.remove.bind(p), 700);
    }
    if (stamps.length > 14) stamps.shift().remove();
    setTimeout(function () { s.classList.add('gone'); setTimeout(function () { s.remove(); var i = stamps.indexOf(s); if (i >= 0) stamps.splice(i, 1); }, 900); }, 2600);
  }
  doc.addEventListener('click', function (e) {
    if (e.target.closest('a, button, input, select, textarea, label, pre, code, .mermaid')) return;
    if (getSelection && String(getSelection()).length) return;
    if (!e.target.closest('#inicio')) return;   /* el sello JK solo en el encabezado */
    stamp(e.clientX, e.clientY + scrollY);
  });

  /* ---------- secreto: escribir «jk» ---------- */
  var buf = '';
  addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    buf = (buf + (e.key || '').toLowerCase()).slice(-2);
    if (buf !== 'jk') return; buf = '';
    root.classList.add('party'); flash();
    for (var i = 0; i < 36; i++) (function (i) {
      setTimeout(function () {
        var s = seal('rain'); s.style.left = (Math.random() * 100) + 'vw'; s.style.setProperty('--r', (Math.random() * 720 - 360).toFixed(0) + 'deg');
        s.style.setProperty('--d', (1.6 + Math.random() * 1.6).toFixed(2) + 's'); s.style.setProperty('--z', (.5 + Math.random()).toFixed(2));
        doc.body.appendChild(s); setTimeout(s.remove.bind(s), 3400);
      }, i * 60);
    })(i);
    setTimeout(function () { root.classList.remove('party'); }, 4200);
  });
})();
