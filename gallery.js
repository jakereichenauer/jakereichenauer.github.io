let images = [];
let currentIndex = 0;
let isMosaicView = false;
let masonry = null; // Masonry instancedocument.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded - initializing gallery');
  const singleView = document.getElementById('single-view');
  const mosaicView = document.getElementById('mosaic-view');
  const toggleButton = document.getElementById('toggle-view');
  const galleryImage = document.getElementById('gallery-image');  if (!singleView || !mosaicView || !toggleButton || !galleryImage) {
    console.error('Missing DOM elements - check HTML IDs');
    return;
  }  // Ensure initial state: single view visible, mosaic hidden
  singleView.classList.remove('hidden');
  mosaicView.classList.add('hidden');  // Fallback images if JSON fails
  const fallbackImages = [
    { src: 'images/model-tests/P1.jpg', alt: 'Portfolio Image 1', type: 'normal', category: 'portfolio' },
    { src: 'images/model-tests/P2.jpg', alt: 'Portfolio Image 2', type: 'tall', category: 'portfolio' }
  ];  // Load JSON
  fetch('gallery-data.json')
    .then(response => {
      console.log('Fetch response status:', response.status);
      if (!response.ok) {
        throw new Error(HTTP ${response.status}: ${response.statusText});
      }
      return response.json();
    })
    .then(data => {
      console.log('JSON loaded successfully:', data.images.length, 'images');
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
    });  function populateMosaicView() {
    console.log('Populating mosaic with', images.length, 'images');
    mosaicView.innerHTML = ''; // Clear previous content
    images.forEach(image => {
      const item = document.createElement('div');
      item.className = gallery-item ${image.type || 'normal'} ${image.category || ''};  const link = document.createElement('a');
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

// Initialize Masonry with dynamic column width
initMasonry();  }  function initMasonry() {
    if (masonry) {
      masonry.destroy(); // Destroy previous if exists
    }
    const columnWidth = window.innerWidth < 769 ? 120 : 200; // Mobile: 120px (2 columns), Desktop: 200px (6-7 columns)
    masonry = new Masonry(mosaicView, {
      itemSelector: '.gallery-item',
      columnWidth: columnWidth, // Dynamic for multi-column
      gutter: 8,
      fitWidth: true // Centers the grid
    });
    console.log(Masonry initialized with ${columnWidth}px columns);
    masonry.layout(); // Force immediate layout
  }  function updateSingleView() {
    if (images.length > 0) {
      galleryImage.src = images[currentIndex].src;
      galleryImage.alt = images[currentIndex].alt;
      console.log('Single view updated to:', images[currentIndex].src);
    }
  }  // Toggle function
  window.toggleView = function() {
    console.log('Toggle clicked - current view:', isMosaicView ? 'mosaic' : 'single');
    isMosaicView = !isMosaicView;
    singleView.classList.toggle('hidden', isMosaicView);
    mosaicView.classList.toggle('hidden', !isMosaicView);
    toggleButton.textContent = isMosaicView ? 'Switch to Single View' : 'Switch to Mosaic View';// Re-init Masonry when switching to mosaic
if (isMosaicView) {
  setTimeout(initMasonry, 100); // Short delay for DOM update
}  };  // Resize listener for responsive relayout
  window.addEventListener('resize', () => {
    if (isMosaicView && masonry) {
      initMasonry(); // Re-init on resize
    }
  });  // Navigation for single view
  window.nextImage = function() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSingleView();
  };  window.prevImage = function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSingleView();
  };  // Swipe support for single view
  let touchStartX = 0;
  let touchEndX = 0;  singleView.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });  singleView.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX - touchStartX > swipeThreshold) prevImage();
    else if (touchStartX - touchEndX > swipeThreshold) nextImage();
  }, { passive: true });
});
