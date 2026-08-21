// Hagos Portfolio Core Actions

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initScrollAnimations();
  initProjectDialogs();
  initContactForm();
});

// Theme Management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark'; // default to dark
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.style.colorScheme = savedTheme;

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.colorScheme = newTheme;
    localStorage.setItem('theme', newTheme);
  });
}

// Header & Navigation Actions
function initHeader() {
  const header = document.getElementById('site-header');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Shrink header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active navigation highlight based on section scroll positions
    highlightActiveSection();
  });

  // Mobile navigation drawer toggle
  mobileNavToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close mobile navigation drawer when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      
      // Update active nav class manually on click
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  function openMobileMenu() {
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 120; // offset header height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// Scroll Entrance Reveal Animations
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.skills-card, .project-card, .timeline-item, .contact-info-panel, .contact-form-panel');
  
  // Add class for animations
  revealElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // trigger animation only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Project Details Dialogs
function initProjectDialogs() {
  const openButtons = document.querySelectorAll('.open-dialog-btn');
  const dialogs = document.querySelectorAll('.project-dialog');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dialogId = btn.getAttribute('data-dialog');
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        dialog.showModal();
        document.body.style.overflow = 'hidden'; // stop body scrolling
      }
    });
  });

  dialogs.forEach(dialog => {
    const closeBtn = dialog.querySelector('.dialog-close-btn');

    // Close when tapping exit icon
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });

    // Close when tapping background backdrop
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    // Restore body scroll on close
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('contact-toast');
  const toastMessage = document.getElementById('toast-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check validity
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Trigger :user-invalid styling manually by marking them touched/dirty
      if (!input.checkValidity()) {
        isValid = false;
        // Native check triggers visual errors
        input.dispatchEvent(new Event('input')); 
      }
    });

    if (!isValid) {
      showToast('Please correct form errors before sending.', true);
      return;
    }

    // Simulate sending message
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    setTimeout(() => {
      // Success
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      
      showToast('Thank you! Hagos will get back to you shortly.', false);
    }, 1500);
  });

  function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.className = 'toast-notification show';
    
    if (isError) {
      toast.classList.add('error');
    }
    
    toast.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 4000);
  }
}
