// Fadokun Adebare — portfolio scripts
(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var nav = document.querySelector('.nav');
  var menuBtn = document.querySelector('.menu-btn');
  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- videos: play muted when on screen ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (!reduce && 'IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (v.muted) { v.pause(); }
      });
    }, { threshold: 0.4 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  /* ---------- work filters ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var projects = document.querySelectorAll('.project');
  var emptyMsg = document.querySelector('[data-empty]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var shown = 0;
      projects.forEach(function (p) {
        var tags = (p.getAttribute('data-tags') || '').split(' ');
        var match = f === 'all' || tags.indexOf(f) !== -1;
        p.hidden = !match;
        if (match) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown !== 0;
    });
  });

  /* ---------- contact: build a brief ---------- */
  var brief = document.querySelector('#brief');
  if (brief) {
    var needs = brief.querySelectorAll('[data-need]');
    var whens = brief.querySelectorAll('[data-when]');
    var nameIn = brief.querySelector('#name');
    var emailIn = brief.querySelector('#email');
    var msgIn = brief.querySelector('#msg');
    var outNeed = document.querySelector('[data-out="need"]');
    var outWhen = document.querySelector('[data-out="when"]');
    var outFrom = document.querySelector('[data-out="from"]');
    var sentTag = document.querySelector('[data-sent]');

    function picked() {
      return Array.prototype.filter.call(needs, function (b) { return b.getAttribute('aria-pressed') === 'true'; })
        .map(function (b) { return b.getAttribute('data-need'); });
    }
    function whenValue() {
      var w = Array.prototype.find.call(whens, function (b) { return b.getAttribute('aria-pressed') === 'true'; });
      return w ? w.getAttribute('data-when') : '';
    }
    function needText() {
      var list = picked().map(function (s) { return s.toLowerCase(); });
      if (!list.length) return '…';
      if (list.length === 1) return list[0];
      return list.slice(0, -1).join(', ') + ' & ' + list[list.length - 1];
    }
    function whenText() {
      var w = whenValue();
      if (!w) return '…';
      if (w === 'Just exploring') return 'whenever it feels right';
      if (w === 'ASAP') return 'ASAP';
      return w.toLowerCase();
    }
    function render() {
      outNeed.textContent = needText();
      outWhen.textContent = whenText();
      outFrom.textContent = nameIn.value.trim() || 'a future collaborator';
      if (sentTag) sentTag.hidden = true;
    }

    needs.forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        render();
      });
    });
    whens.forEach(function (b) {
      b.addEventListener('click', function () {
        whens.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        render();
      });
    });
    nameIn.addEventListener('input', render);

    var lastBody = '';
    var copyBtn = document.querySelector('[data-copy]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var done = function () { copyBtn.textContent = 'Copied ✓'; };
        try {
          navigator.clipboard.writeText(lastBody).then(done, function () { copyBtn.textContent = 'Copy failed: select it from the note'; });
        } catch (err) { copyBtn.textContent = 'Copy failed: select it from the note'; }
      });
    }

    brief.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameIn.value.trim() || 'A future collaborator';
      var body =
        'Hi Fadokun!\n\n' +
        'I need help with ' + needText() + '.\n' +
        "We're launching " + whenText() + '.\n\n' +
        (msgIn.value.trim() ? msgIn.value.trim() + '\n\n' : '') +
        '— ' + name + (emailIn.value.trim() ? ' (' + emailIn.value.trim() + ')' : '');
      lastBody = body;
      var subject = 'Project brief from ' + name;
      window.location.href = 'mailto:fadokunadebare9@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (sentTag) sentTag.hidden = false;
      if (copyBtn) copyBtn.textContent = 'Copy brief';
    });

    render();
  }
})();
