let images = [];
let currentIndex = 0;
let isMosaicView = false;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded - initializing gallery'); // Debug log
  const singleView = document.getElementById('single-view');
  const mosaicView = document.getElementById('mosaic-view');
  const toggleButton = document.getElementById('toggle-view');
  const galleryImage = document.getElementById('gallery-image');

  if (!singleView || !mosaicView || !toggleButton || !galleryImage) {
    console.error('Missing DOM elements - check HTML IDs');
    return;
  }

  // Ensure initial state: single view visible, mosaic hidden
  singleView.classList.remove('hidden');
  mosaicView.classList.add('hidden');

  // Fallback images if JSON fails
  const fallbackImages = [
    { src: 'images/model-tests/P1.jpg', alt: 'Portfolio Image 1', type: 'normal', category: 'portfolio' },
    { src: 'images/model-tests/P2.jpg', alt: 'Portfolio Image 2', type: 'tall', category: 'portfolio' }
  ];

  // Load JSON
  fetch('gallery-data.json')
    .then(response => {
      console.log('Fetch response status:', response.status); // Debug log
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('JSON loaded successfully:', data.images.length, 'images'); // Debug log
      images = data.images.sort(() => Math.random() - 0.5);
      updateSingleView();
      populateMosaicView();
    })
    .catch(error => {
      console.error('JSON fetch error:', error);
      images = fallbackImages;
      updateSingleView();
      populateMosaicView();
      mosaicView.innerHTML = '<p>Using fallback images (check gallery-data.json).</p>';
    });

  function populateMosaicView() {
    console.log('Populating mosaic with', images.length, 'images'); // Debug log
    mosaicView.innerHTML = ''; // Clear any duplicates
    images.forEach(image => {
      const item = document.createElement('div');
      item.className = `gallery-item ${image.type || 'normal'} ${image.category || ''}`;
      
      const link = document.createElement('a');
      link.href = image.src;
      link.setAttribute('data-lightbox', 'gallery');
      link.setAttribute('data-title', image.alt);
      
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = 'lazy';
      
      link.appendChild(img);
      item.appendChild(link);
      mosaicView.appendChild(item);
    });
  }

  function updateSingleView() {
    if (images.length > 0) {
      galleryImage.src = images[currentIndex].src;
      galleryImage.alt = images[currentIndex].alt;
      console.log('Single view updated to:', images[currentIndex].src); // Debug log
    }
  }

  // Toggle function (now global and always available)
  window.toggleView = function() {
    console.log('Toggle clicked - current view:', isMosaicView ? 'mosaic' : 'single'); // Debug log
    isMosaicView = !isMosaicView;
    singleView.classList.toggle('hidden', isMosaicView);
    mosaicView.classList.toggle('hidden', !isMosaicView);
    toggleButton.textContent = isMosaicView ? 'Switch to Single View' : 'Switch to Mosaic View';
  };

  // Navigation for single view
  window.nextImage = function() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSingleView();
  };

  window.prevImage = function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSingleView();
  };

  // Swipe support for single view
  let touchStartX = 0;
  let touchEndX = 0;

  singleView.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  singleView.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX - touchStartX > swipeThreshold) {
      prevImage();
    } else if (touchStartX - touchEndX > swipeThreshold) {
      nextImage();
    }
  });
});
