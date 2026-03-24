(function() {
    // ---------------------- HAMBURGER MENU TOGGLE ------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      // Close menu when a link is clicked
      const navLinks = navMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });

      // Close menu on window resize if screen is large enough
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    }

    // ---------------------- HERO SMOOTH CAROUSEL (auto slide, infinite) ------------------
    const heroCarousel = document.getElementById('heroCarousel');
    if(heroCarousel) {
      const heroImages = Array.from(heroCarousel.querySelectorAll('img'));
      let heroActiveIndex = 0;
      let heroInterval;

      function showHeroImage(index) {
        heroImages.forEach((img, i) => {
          if(i === index) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
      }

      function nextHeroImage() {
        heroActiveIndex = (heroActiveIndex + 1) % heroImages.length;
        showHeroImage(heroActiveIndex);
      }

      function startHeroAuto() {
        if(heroInterval) clearInterval(heroInterval);
        heroInterval = setInterval(nextHeroImage, 4500);
      }

      startHeroAuto();
      // optional pause on hover for better UX
      const heroSection = document.querySelector('.hero');
      heroSection.addEventListener('mouseenter', () => clearInterval(heroInterval));
      heroSection.addEventListener('mouseleave', startHeroAuto);
      showHeroImage(0);
    }

    // ---------- Product Carousels with smooth transitions & dot navigation ----------
    const carouselContainers = [
      { id: 'carouselHandbags', autoIntervalTime: 4000 },
      { id: 'carouselShoes', autoIntervalTime: 4200 },
      { id: 'carouselDresses', autoIntervalTime: 3800 },
      { id: 'carouselNecklaces', autoIntervalTime: 4100 }
    ];

    // store intervals and state per carousel
    const carouselStates = new Map();

    function setupProductCarousel(containerId, autoTime) {
      const container = document.getElementById(containerId);
      if(!container) return;
      let images = Array.from(container.querySelectorAll('img'));
      if(images.length === 0) return;

      let activeIdx = 0;
      let autoInterval = null;

      // create dots container
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-controls';
      const dots = [];

      images.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if(idx === activeIdx) dot.classList.add('active-dot');
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToImage(idx);
          resetAutoTimer();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
      container.style.position = 'relative';
      container.appendChild(dotsContainer);

      function updateDotsActive(index) {
        dots.forEach((dot, i) => {
          if(i === index) dot.classList.add('active-dot');
          else dot.classList.remove('active-dot');
        });
      }

      function showImage(index) {
        images.forEach((img, i) => {
          if(i === index) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
        activeIdx = index;
        updateDotsActive(activeIdx);
      }

      function goToImage(index) {
        if(index < 0) index = images.length - 1;
        if(index >= images.length) index = 0;
        showImage(index);
      }

      function nextImage() {
        let next = (activeIdx + 1) % images.length;
        goToImage(next);
      }

      function startAuto() {
        if(autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
          nextImage();
        }, autoTime);
      }

      function resetAutoTimer() {
        if(autoInterval) {
          clearInterval(autoInterval);
          startAuto();
        }
      }

      // initial show
      showImage(0);
      startAuto();

      // store state for potential cleanup
      carouselStates.set(containerId, {
        interval: autoInterval,
        container: container,
        resetAutoTimer,
        stopAuto: () => { if(autoInterval) clearInterval(autoInterval); }
      });

      // pause on hover for better UX (smooth interaction)
      container.addEventListener('mouseenter', () => {
        if(autoInterval) clearInterval(autoInterval);
      });
      container.addEventListener('mouseleave', () => {
        if(carouselStates.get(containerId)?.interval) clearInterval(autoInterval);
        startAuto();
      });
    }

    // initialize all product carousels
    carouselContainers.forEach(c => setupProductCarousel(c.id, c.autoIntervalTime));

    // optional: re-focus on window blur just to keep robust, but fine
    window.addEventListener('beforeunload', () => {
      for(let [id, state] of carouselStates.entries()) {
        if(state.stopAuto) state.stopAuto();
      }
    });

    // NEWSLETTER subscription interactive alert (polite feedback)
    const subscribeButton = document.getElementById('subscribeBtn');
    if(subscribeButton) {
      subscribeButton.addEventListener('click', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('subName');
        const emailInput = document.getElementById('subEmail');
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';

        if(!name && !email) {
          alert("✨ Please enter your name and email to receive style updates.");
        } else if(!email) {
          alert("📧 Kindly provide your email address.");
        } else if(!email.includes('@') || !email.includes('.')) {
          alert("Please enter a valid email address.");
        } else {
          alert(`🎉 Thank you ${name || 'dear fashionista'}! You're now subscribed to Ngaara newsletter.`);
          if(nameInput) nameInput.value = '';
          if(emailInput) emailInput.value = '';
        }
      });
    }

    // Search bar functional (simple UI filter demo - product cards filter by title/content)
    const searchInput = document.querySelector('.search');
    if(searchInput) {
      searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.card');
        if(query === "") {
          allCards.forEach(card => card.style.display = 'flex');
          return;
        }
        allCards.forEach(card => {
          const titleElem = card.querySelector('.content h2');
          const descElem = card.querySelector('.content p');
          const title = titleElem ? titleElem.innerText.toLowerCase() : '';
          const desc = descElem ? descElem.innerText.toLowerCase() : '';
          if(title.includes(query) || desc.includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // small animation for header on scroll? (nice subtle)
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if(window.scrollY > 60) {
        header.style.background = 'rgba(255, 250, 245, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
      } else {
        header.style.background = 'rgba(255, 250, 245, 0.96)';
        header.style.boxShadow = 'none';
      }
    });
    
    // for hero images smooth fallback if any image fails to load placeholder remains fine
    // Add additional manual dot click protection for hero? Already perfect.
    // ensure product carousel images have active on first load
    document.querySelectorAll('.carousel').forEach(car => {
      const firstImg = car.querySelector('img');
      if(firstImg && !firstImg.classList.contains('active')) {
        const imgs = Array.from(car.querySelectorAll('img'));
        if(imgs.length) imgs[0].classList.add('active');
      }
    });
  })();