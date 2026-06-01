/* ──────────────────────────────────────────────────────────────
   Pulseforge — site.js
   Shared interactions across all pages
   ────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* ─── CUSTOM CURSOR ──────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  if (cursor && !window.matchMedia('(hover: none)').matches) {
    let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;
    window.addEventListener('mousemove', e => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    function moveCursor() {
      cursorX += (targetX - cursorX) * 0.25;
      cursorY += (targetY - cursorY) * 0.25;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestAnimationFrame(moveCursor);
    }
    moveCursor();

    // attach hover state to all interactive elements
    const attachHover = () => {
      document.querySelectorAll('a, button, .case, input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    };
    attachHover();
  }

  /* ─── SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ─── MOBILE NAV TOGGLE ──────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navUl = document.querySelector('nav.top ul');
  if (navToggle && navUl) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navUl.classList.toggle('open');
    });
    navUl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navUl.classList.remove('open');
      });
    });
  }

  /* ─── HERO CANVAS — WAVEFORM + SPARKS ────────────────────── */
  const canvas = document.getElementById('wave-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, DPR;
    const sparks = [];
    let t = 0;
    let lastSpawn = 0;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function waveAt(x, time) {
      const cy = H * 0.55;
      let y = cy;
      y += Math.sin((x * 0.004) + time * 0.0008) * 18;
      y += Math.sin((x * 0.011) + time * 0.0015) * 9;
      const phase = (x * 0.007 + time * 0.002) % (Math.PI * 2);
      const spike = Math.exp(-Math.pow((phase - Math.PI) * 2.4, 2)) * 95;
      y -= spike;
      return y;
    }

    function frame(now) {
      t = now;

      if (prefersReducedMotion) {
        // single static frame, no animation
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, W, H);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(244,241,234,0.4)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 2) {
          const y = waveAt(x, 0);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      ctx.fillStyle = 'rgba(5,5,5,0.18)';
      ctx.fillRect(0, 0, W, H);

      // main waveform
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(244,241,234,0.55)';
      ctx.lineWidth = 1.1;
      let peakX = null, peakY = Infinity;
      for (let x = 0; x <= W; x += 2) {
        const y = waveAt(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (y < peakY) { peakY = y; peakX = x; }
      }
      ctx.stroke();

      // glow stroke
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,122,26,0.18)';
      ctx.lineWidth = 2.5;
      for (let x = 0; x <= W; x += 2) {
        const y = waveAt(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // spawn sparks at peaks
      const cy = H * 0.55;
      if (peakY < cy - 60 && (t - lastSpawn) > 35) {
        const count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          sparks.push({
            x: peakX + (Math.random() - 0.5) * 8,
            y: peakY,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -0.8 - Math.random() * 1.4,
            life: 0,
            max: 80 + Math.random() * 90,
            size: 1 + Math.random() * 2.2,
            hot: Math.random() > 0.6
          });
        }
        lastSpawn = t;
      }

      // update and draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.005;
        s.vy *= 0.995;
        const lifeRatio = s.life / s.max;
        if (lifeRatio >= 1) { sparks.splice(i, 1); continue; }

        const alpha = (1 - lifeRatio) * 0.9;
        const r = s.size * (1 - lifeRatio * 0.5);

        // glow
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 6);
        grad.addColorStop(0, s.hot ? `rgba(255,200,140,${alpha})` : `rgba(255,122,26,${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(255,122,26,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 6, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = s.hot ? `rgba(255,235,200,${alpha})` : `rgba(255,160,80,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
