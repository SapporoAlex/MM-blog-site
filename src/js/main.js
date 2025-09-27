    const backToTopBtn = document.getElementById('backToTop');

    // Show button when scrolled down
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    // Scroll to top smoothly
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });