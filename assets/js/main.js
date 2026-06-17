/* =========================================================================
   KORTIZOL RESET — interactions
   Vanilla JS, no dependencies. Progressive & accessible.
   ========================================================================= */
(function () {
  'use strict';
  var doc = document;
  var body = doc.body;

  /* ----- Year in footer ------------------------------------------------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Sticky header shadow ------------------------------------------ */
  var header = doc.querySelector('.site-header');
  var onScrollHeader = function () {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScrollHeader();

  /* ----- Mobile navigation --------------------------------------------- */
  var toggle = doc.getElementById('navToggle');
  var overlay = doc.getElementById('navOverlay');
  var menu = doc.getElementById('menu');

  function setNav(open) {
    body.classList.toggle('nav-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (toggle) toggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!body.classList.contains('nav-open')); });
  if (overlay) overlay.addEventListener('click', function () { setNav(false); });
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setNav(false); closeModal(); }
  });

  /* ----- Reveal on scroll ---------------------------------------------- */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Back to top + mobile sticky CTA ------------------------------- */
  var toTop = doc.getElementById('toTop');
  var mobileCta = doc.getElementById('mobileCta');
  var hero = doc.querySelector('.hero');
  var pricing = doc.getElementById('cena');

  function onScroll() {
    onScrollHeader();
    var y = window.scrollY;
    if (toTop) toTop.classList.toggle('show', y > 700);

    if (mobileCta) {
      var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 600;
      var pricingTop = pricing ? pricing.offsetTop - 200 : Infinity;
      var pricingBottom = pricing ? pricing.offsetTop + pricing.offsetHeight : Infinity;
      // show after hero, hide while pricing section is on screen
      var show = y > heroBottom && !(y + window.innerHeight > pricingTop && y < pricingBottom);
      mobileCta.classList.toggle('show', show);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ----- Evergreen 24h countdown --------------------------------------- */
  var KEY = 'kr_deadline';
  var WINDOW_MS = 24 * 60 * 60 * 1000;
  function getDeadline() {
    var stored = 0;
    try { stored = parseInt(localStorage.getItem(KEY) || '0', 10); } catch (e) {}
    var now = Date.now();
    if (!stored || stored <= now) {
      stored = now + WINDOW_MS;
      try { localStorage.setItem(KEY, String(stored)); } catch (e) {}
    }
    return stored;
  }
  var deadline = getDeadline();
  var counters = doc.querySelectorAll('[data-countdown]');
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tickCountdown() {
    var diff = Math.max(0, deadline - Date.now());
    if (diff <= 0) { deadline = getDeadline(); diff = deadline - Date.now(); }
    var totalSec = Math.floor(diff / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    counters.forEach(function (c) {
      var H = c.querySelector('[data-h]'), M = c.querySelector('[data-m]'), S = c.querySelector('[data-s]');
      if (H) H.textContent = pad(h);
      if (M) M.textContent = pad(m);
      if (S) S.textContent = pad(s);
    });
  }
  if (counters.length) { tickCountdown(); setInterval(tickCountdown, 1000); }

  /* ----- Order modal (lead capture) ------------------------------------ */
  /* Po spuštění napoj formulář na svou platební bránu / nástroj
     (FAPI, SimpleShop, Stripe, Shoptet…) — viz README.md.            */
  var LANG = (doc.documentElement.getAttribute('lang') || 'cs').toLowerCase().slice(0, 2);
  var STR = {
    cs: {
      close: 'Zavřít', step: 'Poslední krok', title: 'Rezervuj si místo v Kortizol Resetu',
      intro: 'Vyplň jméno a e-mail. Pošleme ti pokyny k platbě a po zaplacení získáš okamžitý přístup + 3 bonusy zdarma.',
      name: 'Jméno', namePh: 'Tvoje jméno', email: 'E-mail', emailPh: 'tvuj@email.cz',
      submit: 'Závazně si rezervovat místo', safe: '🔒 Tvé údaje jsou v bezpečí. Žádný spam.',
      doneTitle: 'Hotovo! Máš rezervováno 🎉',
      doneText: 'Zkontroluj e-mail — posíláme ti pokyny k platbě. Těším se na tebe v programu!<br><br><em style="font-size:.85rem">(Demo: formulář napoj na svou platební bránu — viz README.)</em>'
    },
    en: {
      close: 'Close', step: 'Last step', title: 'Reserve your spot in Cortisol Reset',
      intro: 'Enter your name and email. We\'ll send payment instructions and you\'ll get instant access + 3 free bonuses after payment.',
      name: 'Name', namePh: 'Your name', email: 'Email', emailPh: 'you@email.com',
      submit: 'Reserve my spot', safe: '🔒 Your details are safe. No spam.',
      doneTitle: 'Done! Your spot is reserved 🎉',
      doneText: 'Check your email — we\'re sending payment instructions. See you in the program!<br><br><em style="font-size:.85rem">(Demo: connect this form to your payment gateway — see README.)</em>'
    }
  };
  var L = STR[LANG] || STR.cs;
  var modal = null;
  function buildModal() {
    if (modal) return modal;
    modal = doc.createElement('div');
    modal.className = 'kr-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'krModalTitle');
    modal.innerHTML =
      '<div class="kr-modal__backdrop" data-close></div>' +
      '<div class="kr-modal__card">' +
        '<button class="kr-modal__close" data-close aria-label="' + L.close + '">&times;</button>' +
        '<div class="kr-modal__view" data-view="form">' +
          '<span class="eyebrow">' + L.step + '</span>' +
          '<h3 id="krModalTitle">' + L.title + '</h3>' +
          '<p style="color:var(--text-soft);margin:.4rem 0 1.2rem">' + L.intro + '</p>' +
          '<form id="krForm" novalidate>' +
            '<label class="kr-field"><span>' + L.name + '</span><input type="text" name="name" required autocomplete="given-name" placeholder="' + L.namePh + '"></label>' +
            '<label class="kr-field"><span>' + L.email + '</span><input type="email" name="email" required autocomplete="email" placeholder="' + L.emailPh + '"></label>' +
            '<button type="submit" class="btn btn--big btn--block">' + L.submit + '</button>' +
            '<p class="btn-note center">' + L.safe + '</p>' +
          '</form>' +
        '</div>' +
        '<div class="kr-modal__view" data-view="done" hidden>' +
          '<div class="kr-done-ic" aria-hidden="true">✓</div>' +
          '<h3>' + L.doneTitle + '</h3>' +
          '<p style="color:var(--text-soft);margin-top:.5rem">' + L.doneText + '</p>' +
          '<button class="btn btn--ghost" data-close style="margin-top:1.2rem">' + L.close + '</button>' +
        '</div>' +
      '</div>';
    body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    var form = modal.querySelector('#krForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        if (!name) form.name.focus(); else form.email.focus();
        return;
      }
      // === Sem napoj odeslání na svůj backend / platební bránu ===
      modal.querySelector('[data-view="form"]').hidden = true;
      modal.querySelector('[data-view="done"]').hidden = false;
    });
    return modal;
  }
  var lastFocus = null;
  function openModal() {
    buildModal();
    lastFocus = doc.activeElement;
    modal.classList.add('open');
    body.style.overflow = 'hidden';
    var first = modal.querySelector('input, button');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeModal() {
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
  }
  // Hook up the final order button(s)
  doc.querySelectorAll('#orderBtn, [data-order]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
})();
