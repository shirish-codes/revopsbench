/**
 * RevOps Bench — Main JS v2.0
 * FusionAI-inspired dark theme interactions
 */
(function() {
  'use strict';

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href*="#join-the-bench"], a[href*="#capabilities"], a[href*="#tech-stack"], a[href*="#how-it-works"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');
      var hash = href.includes('#') ? '#' + href.split('#')[1] : null;
      if (!hash) return;
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        var offset = 80; // header height
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Funnel bar animation ── */
  function animateFunnelBars(container) {
    container.querySelectorAll('.funnel-fill[data-w]').forEach(function(bar) {
      bar.style.width = bar.getAttribute('data-w');
    });
  }

  /* ── Intersection Observer: fade-up + funnel bars ── */
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        var bars = e.target.querySelectorAll('.funnel-fill[data-w]');
        if (bars.length) {
          setTimeout(function() { animateFunnelBars(e.target); }, 300);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Observe all fade-up elements
  document.querySelectorAll('.fade-up, .glass-card, .process-card').forEach(function(el) {
    io.observe(el);
  });

  // Also observe the hero card specifically for funnel bars
  var heroCard = document.querySelector('.hero-visual-card');
  if (heroCard) {
    // Animate funnel bars after a short delay on load
    setTimeout(function() { animateFunnelBars(heroCard); }, 800);
  }

  /* ── Header: subtle scroll effect ── */
  var header = document.querySelector('header.wp-block-group, .wp-block-template-part header, header.site-header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var current = window.pageYOffset;
      if (current > 20) {
        header.style.background = 'rgba(7,7,14,0.95)';
      } else {
        header.style.background = 'rgba(7,7,14,0.8)';
      }
      lastScroll = current;
    }, { passive: true });
  }

  /* ── Ticker: pause on hover (handled via CSS) ── */
  /* ── Ticker: ensure seamless loop on all browsers ── */
  document.querySelectorAll('.ticker-track').forEach(function(track) {
    // Clone is already done via duplicate HTML — this ensures timing
    var items = track.querySelectorAll('.ticker-item');
    if (items.length === 0) return;
  });

  /* ── Add gradient text span if missing ── */
  document.querySelectorAll('.gradient-span').forEach(function(el) {
    el.style.background = 'linear-gradient(135deg, #F97316, #FB923C, #FBBF24)';
    el.style.webkitBackgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.backgroundClip = 'text';
  });

})();
