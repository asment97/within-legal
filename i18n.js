/* WITHIN legal-pages locale switcher.
 *
 * Toggles visibility between <section lang="zh-Hans"> and <section lang="en">
 * blocks inside a single HTML page. Stores the user's choice in
 * localStorage('within.legal.lang') so navigating between pages preserves
 * the locale. Defaults to zh on first load (matches the in-app default
 * for the MY market per HANDOFF §16) — falls back to navigator.language
 * when the stored value is missing.
 */
(function () {
  'use strict';

  var STORE_KEY = 'within.legal.lang';
  var SUPPORTED = ['zh-Hans', 'en'];

  function pickInitial() {
    try {
      var stored = window.localStorage.getItem(STORE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (_) {
      // localStorage blocked (private mode on some browsers); fall through.
    }
    var nav = (navigator.language || 'zh-Hans').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh-Hans';
    return 'en';
  }

  function apply(lang) {
    // Top-level locale blocks (used by privacy / terms / support).
    var sections = document.querySelectorAll('section[lang]');
    for (var i = 0; i < sections.length; i++) {
      sections[i].hidden = sections[i].getAttribute('lang') !== lang;
    }
    // Inline locale spans (used by delete-account.html for form labels +
    // status messages that live outside a <section>).
    var inline = document.querySelectorAll('[data-locale-span]');
    for (var k = 0; k < inline.length; k++) {
      inline[k].hidden = inline[k].getAttribute('lang') !== lang;
    }
    var buttons = document.querySelectorAll('.locale-switcher button');
    for (var j = 0; j < buttons.length; j++) {
      var btnLang = buttons[j].getAttribute('data-lang');
      buttons[j].setAttribute(
        'aria-pressed',
        btnLang === lang ? 'true' : 'false',
      );
    }
    document.documentElement.setAttribute('lang', lang);
    document.body.setAttribute('data-lang', lang);
    try {
      window.localStorage.setItem(STORE_KEY, lang);
    } catch (_) {
      // No-op when localStorage is blocked.
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initial = pickInitial();
    apply(initial);

    var buttons = document.querySelectorAll('.locale-switcher button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (ev) {
        var lang = ev.currentTarget.getAttribute('data-lang');
        if (SUPPORTED.indexOf(lang) === -1) return;
        apply(lang);
      });
    }
  });
})();
