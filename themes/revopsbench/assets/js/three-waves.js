/**
 * RevOps Bench — Silk Wave Engine v3
 * Pure Canvas 2D flowing ribbon waves for hero + footer.
 * Teal (#00E6A0) & Cyan (#00CFFF) palette.
 */
(function () {
  'use strict';

  /* ─── Helpers ─── */
  function rgba(r, g, b, a) { return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; }

  /* ─── Wave math: composite sine with diagonal sweep ─── */
  function waveAt(x, t, r) {
    return r.baseY
      + Math.sin(x * r.f1 + t * r.s1 + r.p           ) * r.a1
      + Math.sin(x * r.f2 + t * r.s2 + r.p + 1.4     ) * r.a2
      + Math.sin(x * r.f3 + t * r.s3 + r.p + 2.8     ) * r.a3
      + x * r.diag;   /* diagonal tilt across canvas width */
  }

  /* ─── Draw one silk ribbon ─── */
  function drawRibbon(ctx, W, H, t, r) {
    var thick = r.thick;
    var step  = 5;
    var steps = Math.ceil(W / step);

    /* Glow pass */
    ctx.save();
    ctx.shadowColor = r.glow;
    ctx.shadowBlur  = r.glowR;

    /* Build ribbon shape: top edge → bottom edge */
    ctx.beginPath();
    for (var i = 0; i <= steps; i++) {
      var x  = i * step;
      var cy = waveAt(x, t, r) * H;
      if (i === 0) ctx.moveTo(x, cy - thick * 0.5);
      else         ctx.lineTo(x, cy - thick * 0.5);
    }
    for (var i = steps; i >= 0; i--) {
      var x  = i * step;
      var cy = waveAt(x, t, r) * H;
      ctx.lineTo(x, cy + thick * 0.5);
    }
    ctx.closePath();

    /* Cross-ribbon gradient (edge→centre→edge) */
    var midY = waveAt(W * 0.5, t, r) * H;
    var g    = ctx.createLinearGradient(0, midY - thick * 0.5, 0, midY + thick * 0.5);
    g.addColorStop(0,    r.edge);
    g.addColorStop(0.18, r.mid);
    g.addColorStop(0.5,  r.peak);
    g.addColorStop(0.82, r.mid);
    g.addColorStop(1,    r.edge);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();

    /* Sheen highlight line along the crest */
    ctx.save();
    ctx.shadowColor = r.sheen;
    ctx.shadowBlur  = 18;
    ctx.beginPath();
    for (var i = 0; i <= steps; i++) {
      var x  = i * step;
      var cy = waveAt(x, t, r) * H;
      if (i === 0) ctx.moveTo(x, cy - thick * 0.18);
      else         ctx.lineTo(x, cy - thick * 0.18);
    }
    ctx.strokeStyle = r.sheen;
    ctx.lineWidth   = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  /* ══════════════════════════════════════════
     HERO WAVES
     Four overlapping silk ribbons sweeping
     diagonally from lower-left → upper-right.
     ══════════════════════════════════════════ */
  function initHeroWave(container) {
    var canvas      = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var W, H;

    function resize() {
      W = canvas.width  = container.offsetWidth  || window.innerWidth;
      H = canvas.height = container.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ribbon definitions — all Y values are fractions of H */
    var ribbons = [
      /* ── Deep teal base layer ── */
      {
        baseY: 0.68, a1: 0.14, a2: 0.055, a3: 0.028,
        f1: 0.0016, f2: 0.0028, f3: 0.0044,
        s1: 0.30,   s2: 0.48,  s3: 0.20,
        p: 0, diag: -0.00016,
        thick: H * 0.22,
        edge:  rgba(0, 90, 110, 0),
        mid:   rgba(0, 150, 130, 0.55),
        peak:  rgba(0, 184, 148, 0.80),
        sheen: rgba(80, 230, 200, 0.30),
        glow:  rgba(0, 184, 148, 0.22),
        glowR: 45
      },
      /* ── Primary teal ribbon ── */
      {
        baseY: 0.50, a1: 0.18, a2: 0.070, a3: 0.035,
        f1: 0.0013, f2: 0.0024, f3: 0.0038,
        s1: 0.38,   s2: 0.55,  s3: 0.25,
        p: 1.6, diag: -0.00020,
        thick: H * 0.17,
        edge:  rgba(0, 110, 120, 0),
        mid:   rgba(0, 200, 160, 0.60),
        peak:  rgba(0, 230, 160, 0.90),
        sheen: rgba(130, 255, 220, 0.45),
        glow:  rgba(0, 230, 160, 0.28),
        glowR: 55
      },
      /* ── Cyan accent ribbon ── */
      {
        baseY: 0.34, a1: 0.16, a2: 0.065, a3: 0.030,
        f1: 0.0011, f2: 0.0020, f3: 0.0035,
        s1: 0.28,   s2: 0.42,  s3: 0.18,
        p: 3.2, diag: -0.00018,
        thick: H * 0.14,
        edge:  rgba(0, 100, 180, 0),
        mid:   rgba(0, 180, 230, 0.55),
        peak:  rgba(0, 207, 255, 0.82),
        sheen: rgba(180, 240, 255, 0.45),
        glow:  rgba(0, 207, 255, 0.25),
        glowR: 50
      },
      /* ── Thin bright highlight ── */
      {
        baseY: 0.42, a1: 0.12, a2: 0.050, a3: 0.022,
        f1: 0.0018, f2: 0.0032, f3: 0.0050,
        s1: 0.50,   s2: 0.68,  s3: 0.32,
        p: 5.0, diag: -0.00022,
        thick: H * 0.065,
        edge:  rgba(160, 240, 255, 0),
        mid:   rgba(200, 248, 255, 0.55),
        peak:  rgba(220, 255, 255, 0.80),
        sheen: rgba(240, 255, 255, 0.55),
        glow:  rgba(200, 248, 255, 0.30),
        glowR: 30
      }
    ];

    /* bake pixel thickness now that H is known */
    ribbons.forEach(function (r) { r.thick = H * (r.thick / H || 0.15); });

    var t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.0055;
      ctx.clearRect(0, 0, W, H);
      /* draw back-to-front */
      for (var i = ribbons.length - 1; i >= 0; i--) drawRibbon(ctx, W, H, t, ribbons[i]);
    }
    animate();

    /* recalculate thick on resize */
    window.addEventListener('resize', function () {
      var baseFracs = [0.22, 0.17, 0.14, 0.065];
      ribbons.forEach(function (r, i) { r.thick = H * baseFracs[i]; });
    });
  }

  /* ══════════════════════════════════════════
     FOOTER WAVES
     Ribbons concentrated in lower half,
     rising up gently.
     ══════════════════════════════════════════ */
  function initFooterWave(container) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var W, H;

    function resize() {
      W = canvas.width  = container.offsetWidth  || window.innerWidth;
      H = canvas.height = container.offsetHeight || 200;
    }
    resize();
    window.addEventListener('resize', resize);

    var ribbons = [
      {
        baseY: 0.72, a1: 0.14, a2: 0.055, a3: 0.025,
        f1: 0.0014, f2: 0.0026, f3: 0.0040,
        s1: 0.26,   s2: 0.40,  s3: 0.18,
        p: 0.8, diag: -0.00014,
        thick: H * 0.28,
        edge:  rgba(0, 90, 110, 0),
        mid:   rgba(0, 184, 148, 0.55),
        peak:  rgba(0, 230, 160, 0.80),
        sheen: rgba(100, 255, 210, 0.38),
        glow:  rgba(0, 230, 160, 0.22),
        glowR: 40
      },
      {
        baseY: 0.85, a1: 0.10, a2: 0.040, a3: 0.018,
        f1: 0.0012, f2: 0.0022, f3: 0.0034,
        s1: 0.20,   s2: 0.32,  s3: 0.14,
        p: 2.8, diag: -0.00012,
        thick: H * 0.20,
        edge:  rgba(0, 100, 170, 0),
        mid:   rgba(0, 170, 220, 0.50),
        peak:  rgba(0, 207, 255, 0.75),
        sheen: rgba(170, 235, 255, 0.35),
        glow:  rgba(0, 207, 255, 0.18),
        glowR: 35
      },
      {
        baseY: 0.58, a1: 0.08, a2: 0.032, a3: 0.015,
        f1: 0.0016, f2: 0.0030, f3: 0.0048,
        s1: 0.34,   s2: 0.52,  s3: 0.22,
        p: 4.5, diag: -0.00016,
        thick: H * 0.12,
        edge:  rgba(0, 80, 100, 0),
        mid:   rgba(0, 150, 130, 0.45),
        peak:  rgba(0, 184, 148, 0.68),
        sheen: rgba(60, 220, 190, 0.30),
        glow:  rgba(0, 184, 148, 0.15),
        glowR: 25
      }
    ];

    ribbons.forEach(function (r) { r.thick = H * (r.thick / H || 0.18); });

    var t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.0045;
      ctx.clearRect(0, 0, W, H);
      for (var i = ribbons.length - 1; i >= 0; i--) drawRibbon(ctx, W, H, t, ribbons[i]);
    }
    animate();

    window.addEventListener('resize', function () {
      var baseFracs = [0.28, 0.20, 0.12];
      ribbons.forEach(function (r, i) { r.thick = H * baseFracs[i]; });
    });
  }

  /* ══════════════════════════════════════════
     SECTION DIVIDER ACCENT WAVES
     ══════════════════════════════════════════ */
  function initSectionWave(canvas) {
    if (!canvas) return;
    var ctx  = canvas.getContext('2d');
    var W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth  || 1200;
      H = canvas.height = canvas.offsetHeight || 80;
    }
    resize();
    window.addEventListener('resize', resize);

    var speed = parseFloat(canvas.dataset.speed) || 0.4;
    var flip  = canvas.dataset.flip === 'true';
    var t     = Math.random() * Math.PI * 2;

    function draw() {
      requestAnimationFrame(draw);
      t += 0.007 * speed;
      ctx.clearRect(0, 0, W, H);

      /* teal layer */
      ctx.beginPath();
      ctx.moveTo(0, flip ? 0 : H);
      for (var x = 0; x <= W; x += 4) {
        var y = H * 0.5
          + Math.sin(x * 0.008 + t)       * H * 0.22
          + Math.sin(x * 0.014 + t * 1.4) * H * 0.10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, flip ? 0 : H);
      ctx.lineTo(0, flip ? 0 : H);
      ctx.closePath();
      var g1 = ctx.createLinearGradient(0, 0, 0, H);
      g1.addColorStop(flip ? 0 : 1, 'rgba(0,230,160,0.13)');
      g1.addColorStop(flip ? 1 : 0, 'rgba(0,230,160,0)');
      ctx.fillStyle = g1;
      ctx.fill();

      /* cyan layer */
      ctx.beginPath();
      ctx.moveTo(0, flip ? 0 : H);
      for (var x = 0; x <= W; x += 4) {
        var y = H * 0.5
          + Math.sin(x * 0.010 + t * 0.75 + 1.5) * H * 0.16
          + Math.cos(x * 0.018 + t * 0.90)        * H * 0.07;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, flip ? 0 : H);
      ctx.lineTo(0, flip ? 0 : H);
      ctx.closePath();
      var g2 = ctx.createLinearGradient(0, 0, 0, H);
      g2.addColorStop(flip ? 0 : 1, 'rgba(0,207,255,0.08)');
      g2.addColorStop(flip ? 1 : 0, 'rgba(0,207,255,0)');
      ctx.fillStyle = g2;
      ctx.fill();
    }
    draw();
  }

  /* ══════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════ */
  function boot() {
    var hero   = document.getElementById('hero-wave-canvas');
    var footer = document.getElementById('footer-wave-canvas');
    if (hero)   initHeroWave(hero);
    if (footer) initFooterWave(footer);
    document.querySelectorAll('.section-wave-canvas').forEach(initSectionWave);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
