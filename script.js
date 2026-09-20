/**
 * House Maintenance 24 Hours - Core Vanilla JavaScript
 * Service Areas: Dubai, Ajman, Sharjah, Umm Al Quwain, UAE
 * GitHub Pages Compatible - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CONSTANTS & PHONE NUMBERS
     -------------------------------------------------------------------------- */
  const WHATSAPP_PRIMARY = '971507039506';
  const WHATSAPP_SECONDARY = '971522929187';
  const PHONE_DIRECT = '+971522929187';

  /* --------------------------------------------------------------------------
     2. LIGHT / DARK THEME TOGGLE
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  const syncHeaderMetrics = () => {
    const topBar = document.querySelector('.top-bar');
    const siteHeader = document.getElementById('header');
    const root = document.documentElement;

    if (topBar) {
      root.style.setProperty('--topbar-height', `${topBar.offsetHeight}px`);
    }

    if (siteHeader) {
      root.style.setProperty('--navbar-height', `${siteHeader.offsetHeight}px`);
    }

    const totalHeaderHeight = (topBar ? topBar.offsetHeight : 0) + (siteHeader ? siteHeader.offsetHeight : 0);
    root.style.setProperty('--header-total-height', `${totalHeaderHeight}px`);
  };

  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);

    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-toggle__icon');
      const label = themeToggle.querySelector('.theme-toggle__text');

      if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
      }

      if (label) {
        label.textContent = theme === 'dark' ? 'Dark' : 'Light';
      }
    }

    localStorage.setItem('house-maintenance-theme', theme);
  };

  const savedTheme = localStorage.getItem('house-maintenance-theme');
  const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION MENU TOGGLE (DRAWER & BACKDROP)
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navDrawerClose = document.getElementById('nav-drawer-close');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-actions a');

  const openMenu = () => {
    if (!mainNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('is-open');
    if (navBackdrop) navBackdrop.classList.add('is-active');
    document.body.classList.add('nav-locked');
  };

  const closeMenu = () => {
    if (!mainNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    if (navBackdrop) navBackdrop.classList.remove('is-active');
    document.body.classList.remove('nav-locked');
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navDrawerClose) {
      navDrawerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        closeMenu();
      });
    }

    // Close menu when clicking on any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('is-open')) {
          closeMenu();
        }
      });
    });

    // Close menu when clicking outside of navigation
    document.addEventListener('click', (e) => {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Auto-close if screen resized above tablet breakpoint (> 1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mainNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. HEADER SHADOW + SCROLL SPY (navbar remains visible at all times)
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('main section[id]');
  const backToTopButton = document.getElementById('back-to-top');

  const handleScroll = () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    if (backToTopButton) {
      const shouldShow = window.scrollY > 350;
      backToTopButton.classList.toggle('is-visible', shouldShow);
    }

    const headerOffset = header ? header.offsetHeight + 40 : 100;
    const scrollPosition = window.scrollY + headerOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else if (link.classList.contains('nav-link')) {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  syncHeaderMetrics();
  window.addEventListener('resize', () => {
    syncHeaderMetrics();
    if (window.innerWidth > 1024 && mainNav && mainNav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     4. HERO CAROUSEL SLIDES
     -------------------------------------------------------------------------- */
  const heroBackgroundSlides = document.querySelectorAll('.hero-background-carousel img');

  let heroSlideIndex = 0;
  let heroAutoRotate = null;

  const showHeroSlide = (index) => {
    if (heroBackgroundSlides.length === 0) return;

    const totalSlides = heroBackgroundSlides.length;
    heroSlideIndex = (index + totalSlides) % totalSlides;

    heroBackgroundSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === heroSlideIndex);
    });
  };

  const stopHeroRotation = () => {
    if (heroAutoRotate) {
      clearInterval(heroAutoRotate);
      heroAutoRotate = null;
    }
  };

  const startHeroRotation = () => {
    if (heroBackgroundSlides.length <= 1) return;
    stopHeroRotation();
    heroAutoRotate = setInterval(() => {
      showHeroSlide(heroSlideIndex + 1);
    }, 4500);
  };

  if (heroBackgroundSlides.length > 0) {
    showHeroSlide(0);
    startHeroRotation();
  }

  /* --------------------------------------------------------------------------
     5. SERVICE DETAILS TABS (INTERACTIVE SCOPE WITH MOBILE SCROLL)
     -------------------------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');

        // Update active tab button
        tabButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Smooth scroll clicked tab into view on mobile
        if (window.innerWidth <= 1024) {
          btn.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }

        // Show target tab pane
        tabPanes.forEach((pane) => {
          if (pane.id === targetId) {
            pane.classList.add('active');
            pane.removeAttribute('hidden');
          } else {
            pane.classList.remove('active');
            pane.setAttribute('hidden', 'true');
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. GALLERY CATEGORY FILTER
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterButtons.length > 0 && galleryCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active filter button
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        galleryCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. WHATSAPP SERVICE REQUEST GENERATOR (INTERACTIVE TOOL)
     -------------------------------------------------------------------------- */
  const requestForm = document.getElementById('whatsapp-request-form');
  const reqService = document.getElementById('req-service');
  const reqUrgency = document.getElementById('req-urgency');
  const reqArea = document.getElementById('req-area');
  const reqDetails = document.getElementById('req-details');
  const previewText = document.getElementById('preview-text');

  const updateMessagePreview = () => {
    if (!previewText) return;

    const service = reqService && reqService.value ? reqService.value : '[Select a service]';
    const urgency = reqUrgency ? reqUrgency.value : 'Standard Maintenance';
    const area = reqArea ? reqArea.value : 'Ajman';
    const details = reqDetails && reqDetails.value.trim() ? reqDetails.value.trim() : '[No additional details specified]';

    const formattedMessage = 
`Hello House Maintenance,

I would like to request your service.

Service: ${service}
Urgency: ${urgency}
Area: ${area}
Details: ${details}

Please contact me regarding the service.`;

    previewText.textContent = formattedMessage;
  };

  if (requestForm) {
    // Real-time updates for form fields
    if (reqService) reqService.addEventListener('change', updateMessagePreview);
    if (reqUrgency) reqUrgency.addEventListener('change', updateMessagePreview);
    if (reqArea) reqArea.addEventListener('change', updateMessagePreview);
    if (reqDetails) reqDetails.addEventListener('input', updateMessagePreview);

    // Initial preview setup
    updateMessagePreview();

    // Form submission -> Generate click-to-chat URL
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!reqService || !reqService.value) {
        alert('Please select a maintenance service first.');
        reqService.focus();
        return;
      }

      const service = reqService.value;
      const urgency = reqUrgency ? reqUrgency.value : 'Standard Maintenance';
      const area = reqArea ? reqArea.value : 'Ajman';
      const details = reqDetails && reqDetails.value.trim() ? reqDetails.value.trim() : 'Service inquiry for residential/commercial maintenance.';

      // Get selected WhatsApp number
      const selectedRadio = document.querySelector('input[name="whatsapp_number"]:checked');
      const targetPhone = selectedRadio ? selectedRadio.value : WHATSAPP_PRIMARY;

      // Construct professional message exactly as specified
      const message = 
`Hello House Maintenance,

I would like to request your service.

Service: ${service}
Urgency: ${urgency}
Area: ${area}
Details: ${details}

Please contact me regarding the service.`;

      // Build WhatsApp URL
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* --------------------------------------------------------------------------
     7. PRE-POPULATE SERVICE REQUEST FROM SERVICE CARDS
     -------------------------------------------------------------------------- */
  const serviceCardsCta = document.querySelectorAll('.service-card .btn--service-cta');
  serviceCardsCta.forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && reqService) {
        reqService.value = serviceName;
        updateMessagePreview();
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. FLOATING QUICK-CONTACT SPEED DIAL TOGGLE
     -------------------------------------------------------------------------- */
  const floatingToggle = document.getElementById('floating-toggle');
  const floatingMenu = document.getElementById('floating-menu');
  const floatingContact = document.getElementById('floating-contact');

  if (floatingToggle && floatingMenu) {
    // On small mobile screens, start closed to avoid covering content
    if (window.innerWidth <= 768) {
      floatingMenu.classList.add('is-hidden');
      floatingToggle.setAttribute('aria-expanded', 'false');
    }

    floatingToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = floatingMenu.classList.contains('is-hidden');
      if (isHidden) {
        floatingMenu.classList.remove('is-hidden');
        floatingToggle.setAttribute('aria-expanded', 'true');
      } else {
        floatingMenu.classList.add('is-hidden');
        floatingToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close floating speed dial when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (
        floatingContact &&
        !floatingContact.contains(e.target) &&
        !floatingMenu.classList.contains('is-hidden')
      ) {
        floatingMenu.classList.add('is-hidden');
        floatingToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. PERFORMANCE & SMOOTH SCROLLING WITH OFFSET
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  console.log('House Maintenance 24 Hours website initialized successfully. Serving Dubai, Ajman, Sharjah & Umm Al Quwain.');
});
