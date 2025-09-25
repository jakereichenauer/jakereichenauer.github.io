let images = [];
let currentIndex = 0;
let isMosaicView = false;

document.addEventListener('DOMContentLoaded', () => {
  const singleView = document.getElementById('single-view');
  const mosaicView = document.getElementById('mosaic-view');
  const toggleButton = document.getElementById('toggle-view');
  const galleryImage = document.getElementById('gallery-image');

  fetch('gallery-data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load gallery data.');
      }
      return response.json();
    })
    .then(data => {
      images = data.images.sort(() => Math.random() - 0.5);
      updateSingleView();
      populateMosaicView();
    })
    .catch(error => {
      console.error('Error loading gallery:', error);
      mosaicView.innerHTML = '<p>Oops! Gallery couldn’t load. Check the console.</p>';
    });

  function populateMosaicView() {
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
    galleryImage.src = images[currentIndex].src;
    galleryImage.alt = images[currentIndex].alt;
  }

  window.toggleView = function() {
    isMosaicView = !isMosaicView;
    singleView.classList.toggle('hidden', isMosaicView);
    mosaicView.classList.toggle('hidden', !isMosaicView);
    toggleButton.textContent = isMosaicView ? 'Switch to Single View' : 'Switch to Mosaic View';
  };

  window.nextImage = function() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSingleView();
  };

  window.prevImage = function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSingleView();
  };

  let touchStartX = 0;
  let touchEndX = 0;

  singleView.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  singleView.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 50) prevImage();
    else if (touchStartX - touchEndX > 50) nextImage();
  });
});