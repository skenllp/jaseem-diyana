(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WEDDING = new Date('2026-11-29T17:00:00+05:30');
  const WEDDING_END = new Date('2026-11-29T21:00:00+05:30');

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  /* ---------- Intro: names + one "Open Invitation" button, then the video ---------- */
  const intro = $('#intro');
  const video = $('#introVideo');
  const playBtn = $('#playIntro');
  const skipBtn = $('#skipIntro');
  const reveal = $('#introReveal');
  let introClosed = false;

  // Start screen on every load: first video frame behind the names and the button.
  function showGate() {
    skipBtn.hidden = true;
    requestAnimationFrame(() => reveal.classList.add('is-revealed'));
  }

  function closeIntro() {
    if (introClosed) return;
    introClosed = true;
    video.pause();
    intro.classList.add('is-done');
    document.body.classList.remove('is-intro');
    window.scrollTo(0, 0);
    setTimeout(() => { intro.hidden = true; refreshScroll(); }, 1300);
    startHeroReveal();
  }

  // The tap lets the video (and the optional song) play, then the site opens when the doors finish.
  function startIntro() {
    playSong();
    if (reduceMotion) { closeIntro(); return; }
    reveal.classList.remove('is-revealed');
    skipBtn.hidden = false;
    const p = video.play();
    if (p && p.catch) p.catch(closeIntro);
  }

  /* Optional song: add assets/song.mp3. The mute button only appears if it loads. */
  const song = $('#song');
  const soundBtn = $('#soundBtn');
  song.volume = 0.6;
  function playSong() {
    if (!song.paused) return;
    const p = song.play();
    if (p && p.catch) p.catch(() => {});
  }
  song.addEventListener('playing', () => { soundBtn.hidden = false; soundBtn.setAttribute('aria-pressed', 'true'); soundBtn.setAttribute('aria-label', 'Mute music'); });
  soundBtn.addEventListener('click', () => {
    const on = !song.paused;
    if (on) song.pause(); else playSong();
    soundBtn.setAttribute('aria-pressed', String(!on));
    soundBtn.setAttribute('aria-label', on ? 'Play music' : 'Mute music');
    soundBtn.classList.toggle('is-off', on);
  });

  // Video stays invisible until its first frame is playing, so the poster frame never flickers.
  video.addEventListener('playing', () => video.classList.add('is-playing'));
  playBtn.addEventListener('click', startIntro);
  skipBtn.addEventListener('click', closeIntro);
  video.addEventListener('ended', closeIntro);
  video.addEventListener('error', closeIntro);
  showGate();

  /* ---------- GSAP animations ---------- */
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  let heroStarted = false;

  function refreshScroll() { if (hasGsap) ScrollTrigger.refresh(); }

  function startHeroReveal() {
    if (!hasGsap || reduceMotion || heroStarted) return;
    heroStarted = true;
    gsap.from('#hero [data-reveal]', { opacity: 0, y: 22, duration: 1.2, ease: 'power2.out', stagger: 0.22, delay: 0.4 });
  }

  if (hasGsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Section reveals (hero is handled after the intro closes)
    gsap.utils.toArray('.section:not(.hero)').forEach((section) => {
      const items = section.querySelectorAll('[data-reveal]');
      if (items.length) {
        gsap.from(items, {
          opacity: 0, y: 24, duration: 1, ease: 'power2.out', stagger: 0.14,
          scrollTrigger: { trigger: section, start: 'top 70%', once: true }
        });
      }
    });

    // Gold line reveals
    gsap.utils.toArray('[data-line]').forEach((line) => {
      gsap.from(line, { scaleX: 0, duration: 1.3, ease: 'power2.inOut',
        scrollTrigger: { trigger: line, start: 'top 88%', once: true } });
    });

    // Subtle parallax on full-bleed backgrounds
    gsap.utils.toArray('.bg').forEach((bg) => {
      gsap.fromTo(bg, { yPercent: -4 }, { yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: bg.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Invitation card entrance
    gsap.from('.invite-card', { opacity: 0, scale: 0.985, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: '.invite', start: 'top 70%', once: true } });

    if (introClosed) startHeroReveal();
  }

  /* ---------- Countdown ---------- */
  const cd = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') };
  const cdBox = $('#countdown');
  const cdDone = $('#cdDone');
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const now = new Date();
    const diff = WEDDING - now;
    if (diff <= 0) {
      cdBox.hidden = true;
      cdDone.hidden = false;
      cdDone.textContent = now < WEDDING_END
        ? 'Today is the day. We celebrate tonight at Keyath Garden.'
        : 'Thank you for celebrating with us.';
      return;
    }
    const s = Math.floor(diff / 1000);
    cd.d.textContent = Math.floor(s / 86400);
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Dress code palette ---------- */
  const COLOURS = [
    ['Soft Peach', '#E5C8B2'], ['Dusty Beige', '#CEB5A6'], ['Warm Grey', '#C3B9B0'], ['Muted Blush', '#D7B8B4'],
    ['Sand Gold', '#D5B990'], ['Rose Taupe', '#BDA096'], ['Terracotta Nude', '#CFA082'],
    ['Stone Taupe', '#A69B8C'], ['Eucalyptus', '#85968F'], ['Soft Sage', '#CED5C1'], ['Muted Olive Sage', '#93A08F'],
    ['Pale Khaki', '#B0B5A2'], ['Olive Grey', '#969D7E'], ['Dusty Sage', '#98A78F']
  ];
  const palette = $('#palette');
  const nameOut = $('#swatchName');

  COLOURS.forEach(([name, hex]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.style.setProperty('--c', hex);
    b.dataset.name = name;
    b.setAttribute('aria-label', name);
    b.setAttribute('aria-pressed', 'false');
    palette.appendChild(b);
  });

  const select = (btn) => {
    palette.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s === btn)));
    nameOut.textContent = btn.dataset.name;
  };
  palette.addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (b) select(b); });
  palette.addEventListener('mouseover', (e) => { const b = e.target.closest('.swatch'); if (b) nameOut.textContent = b.dataset.name; });
  palette.addEventListener('focusin', (e) => { const b = e.target.closest('.swatch'); if (b) nameOut.textContent = b.dataset.name; });

  if (hasGsap && !reduceMotion) {
    gsap.from('.swatch', { opacity: 0, y: 26, duration: 0.8, ease: 'power2.out', stagger: 0.06,
      scrollTrigger: { trigger: palette, start: 'top 85%', once: true } });
  }

  /* ---------- Add to calendar (.ics, IST) ---------- */
  $('#addCal').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Noor Al Qamar//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata',
      'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      'UID:jaseem-diyana-wedding-20261129@noor-al-qamar',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART;TZID=Asia/Kolkata:20261129T170000',
      'DTEND;TZID=Asia/Kolkata:20261129T210000',
      'SUMMARY:Wedding of Jaseem Paramban & Diyana M.',
      'DESCRIPTION:With the blessings of Almighty Allah\\, you are warmly invited to celebrate the wedding of Jaseem Paramban and Diyana M. Dress code: Earth Tone Elegance.',
      'LOCATION:Keyath Garden\\, Manjeri\\, Malappuram\\, Kerala',
      'URL:https://share.google/3MggufDtaSU3L1vbf',
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Wedding tomorrow at Keyath Garden', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Jaseem-Diyana-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    say('Calendar file downloaded');
  });

  /* ---------- Share ---------- */
  $('#shareBtn').addEventListener('click', async () => {
    const data = {
      title: 'Jaseem Paramban & Diyana M. | Wedding Invitation',
      text: 'You are invited to the wedding of Jaseem Paramban & Diyana M. on 29 November 2026 at Keyath Garden, Manjeri.',
      url: location.href.split('#')[0]
    };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url);
      say('Invitation link copied');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      try {
        const t = document.createElement('textarea');
        t.value = data.url; document.body.appendChild(t); t.select();
        document.execCommand('copy'); t.remove();
        say('Invitation link copied');
      } catch (e) { say('Copy the link from the address bar'); }
    }
  });
})();
