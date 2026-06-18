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

  /* ----- Order / payment modal ----------------------------------------- */
  var LANG = (doc.documentElement.getAttribute('lang') || 'cs').toLowerCase().slice(0, 2);
  var EN = LANG === 'en';

  /* === PLATEBNÍ ÚDAJE — DOPLŇ po dodání čísla účtu ===
     account: číslo účtu (např. 123456789/0100)
     iban:    IBAN (např. CZ65 0800 0000 1920 0014 5399)
     qr:      vygenerovaný QR (assets/img/qr-platba.svg) — viz README   */
  var PAY = {
    account: '[DOPLŇ ČÍSLO ÚČTU]',
    iban:    '[DOPLŇ IBAN]',
    amountCs: '1 290 Kč',
    amountEn: '€49',
    qr: (EN ? '../assets/img/' : 'assets/img/') + 'qr-platba.svg'
  };

  var T = EN ? {
    eyebrow: 'Order · payment', title: 'Pay and get access',
    sub: 'The complete Cortisol Reset — <b>' + PAY.amountEn + '</b>, one-off.',
    scan: 'Scan in your banking app', qrSoon: 'QR code<br>(coming soon)',
    account: 'Account', iban: 'IBAN', amount: 'Amount', msg: 'Payment message', msgVal: 'your e-mail',
    s1: 'Pay by QR code or bank transfer to the account above.',
    s2: 'Put your <b>e-mail</b> in the payment message (so we know where to send access).',
    s3: 'Once the payment arrives, we send your access + 3 bonuses within 24 h.',
    note: '🔒 Secure bank payment · 14-day money-back guarantee', close: 'Close'
  } : {
    eyebrow: 'Objednávka · platba', title: 'Zaplať a máš přístup',
    sub: 'Kompletní Kortizol Reset — <b>' + PAY.amountCs + '</b> jednorázově.',
    scan: 'Naskenuj v bankovní aplikaci', qrSoon: 'QR platba<br>(brzy doplníme)',
    account: 'Číslo účtu', iban: 'IBAN', amount: 'Částka', msg: 'Zpráva pro příjemce', msgVal: 'tvůj e-mail',
    s1: 'Zaplať QR kódem nebo převodem na účet výše.',
    s2: 'Do zprávy pro příjemce napiš svůj <b>e-mail</b> (ať víme, kam poslat přístup).',
    s3: 'Po připsání platby ti do 24 h pošleme přístup + 3 bonusy.',
    note: '🔒 Bezpečná platba převodem · 14denní garance vrácení peněz', close: 'Zavřít'
  };
  var amount = EN ? PAY.amountEn : PAY.amountCs;

  var modal = null;
  function buildModal() {
    if (modal) return modal;
    modal = doc.createElement('div');
    modal.className = 'kr-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'payTitle');
    modal.innerHTML =
      '<div class="kr-modal__backdrop" data-close></div>' +
      '<div class="kr-modal__card kr-pay">' +
        '<button class="kr-modal__close" data-close aria-label="' + T.close + '">&times;</button>' +
        '<span class="eyebrow">' + T.eyebrow + '</span>' +
        '<h3 id="payTitle">' + T.title + '</h3>' +
        '<p class="kr-pay__sub">' + T.sub + '</p>' +
        '<div class="pay-grid">' +
          '<div class="pay-qr">' +
            '<img src="' + PAY.qr + '" alt="QR" width="170" height="170" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'">' +
            '<div class="pay-qr__soon">' + T.qrSoon + '</div>' +
            '<small>' + T.scan + '</small>' +
          '</div>' +
          '<div class="pay-rows">' +
            '<div class="pay-row"><span>' + T.account + '</span><b>' + PAY.account + '</b></div>' +
            '<div class="pay-row"><span>' + T.iban + '</span><b>' + PAY.iban + '</b></div>' +
            '<div class="pay-row"><span>' + T.amount + '</span><b>' + amount + '</b></div>' +
            '<div class="pay-row"><span>' + T.msg + '</span><b>' + T.msgVal + '</b></div>' +
          '</div>' +
        '</div>' +
        '<ol class="pay-steps"><li>' + T.s1 + '</li><li>' + T.s2 + '</li><li>' + T.s3 + '</li></ol>' +
        '<p class="btn-note center">' + T.note + '</p>' +
      '</div>';
    body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    return modal;
  }
  var lastFocus = null;
  function openModal() {
    buildModal();
    lastFocus = doc.activeElement;
    modal.classList.add('open');
    body.style.overflow = 'hidden';
    var first = modal.querySelector('.kr-modal__close');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeModal() {
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
  }
  // Hook up the order button(s)
  doc.querySelectorAll('#orderBtn, [data-order]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
})();
