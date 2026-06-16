/**
 * Four Seasons Landscaping — Main JavaScript
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const heroBg = document.getElementById('heroBg');
  const quoteForm = document.getElementById('quoteForm');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');

  /* Header scroll effect */
  function handleScroll() {
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* Mobile navigation */
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
      });
    });
  }

  /* Hero parallax */
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroImg = heroBg.querySelector('img');

    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const heroHeight = heroBg.offsetHeight;

      if (scrolled < heroHeight && heroImg) {
        heroImg.style.transform = 'translateY(' + scrolled * 0.35 + 'px)';
      }
    }, { passive: true });
  }

  /* Before & After tabs */
  const baTabs = document.querySelectorAll('.ba-tabs__btn');
  const baPanels = document.querySelectorAll('[data-ba-panel]');

  baTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const index = tab.dataset.ba;

      baTabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      baPanels.forEach(function (panel) {
        if (panel.dataset.baPanel === index) {
          panel.hidden = false;
          panel.classList.add('active');
          initCompareSliders(panel);
        } else {
          panel.hidden = true;
          panel.classList.remove('active');
        }
      });
    });
  });

  /* Before & After comparison sliders */
  function initCompareSliders(container) {
    const scope = container || document;
    const compares = scope.querySelectorAll('[data-compare]');

    compares.forEach(function (compare) {
      if (compare.dataset.initialized) return;
      compare.dataset.initialized = 'true';

      const input = compare.querySelector('.ba-compare__input');
      const before = compare.querySelector('.ba-compare__before');
      const handle = compare.querySelector('.ba-compare__handle');

      if (!input || !before || !handle) return;

      function updatePosition(value) {
        before.style.clipPath = 'inset(0 ' + (100 - value) + '% 0 0)';
        handle.style.left = value + '%';
      }

      input.addEventListener('input', function () {
        updatePosition(input.value);
      });

      let isDragging = false;

      compare.addEventListener('mousedown', function (e) {
        if (e.target === input) return;
        isDragging = true;
        updateFromEvent(e);
      });

      compare.addEventListener('touchstart', function (e) {
        if (e.target === input) return;
        isDragging = true;
        updateFromEvent(e.touches[0]);
      }, { passive: true });

      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        updateFromEvent(e);
      });

      document.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        updateFromEvent(e.touches[0]);
      }, { passive: true });

      document.addEventListener('mouseup', function () {
        isDragging = false;
      });

      document.addEventListener('touchend', function () {
        isDragging = false;
      });

      function updateFromEvent(e) {
        const rect = compare.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        input.value = percent;
        updatePosition(percent);
      }

      updatePosition(input.value);
    });
  }

  initCompareSliders();

  /* Gallery filter */
  const filterBtns = document.querySelectorAll('.gallery-filters__btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter;

      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* Quote form */
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      let valid = true;

      [name, phone, email].forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        valid = false;
      }

      if (!valid) {
        const firstError = quoteForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      if (successModal && typeof successModal.showModal === 'function') {
        successModal.showModal();
      }

      quoteForm.reset();
    });
  }

  if (modalClose && successModal) {
    modalClose.addEventListener('click', function () {
      successModal.close();
    });

    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) {
        successModal.close();
      }
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });

  /* Intersection Observer for fade-in animations */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
      '.service-block, .feature-card, .process-step, .review-card, .service-card, .faq-item'
    );

    animateElements.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease ' + (i % 4) * 0.1 + 's, transform 0.6s ease ' + (i % 4) * 0.1 + 's';
      observer.observe(el);
    });
  }

})();
