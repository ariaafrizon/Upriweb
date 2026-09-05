const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const siteHeader = document.querySelector('.site-header');

function updateNavigationState() {
  siteHeader?.classList.toggle('is-compact', window.innerWidth > 720 && window.scrollY > 120);
}

window.addEventListener('scroll', updateNavigationState, { passive: true });
window.addEventListener('resize', updateNavigationState);
updateNavigationState();

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });
});

const stops = { home: 0, about: 0.835, blog: 0.405, event: 0.2, nft: 0.63, artwork: 0.63, shop: 0.96 };
const visual = document.querySelector('.visual-page');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href').slice(1);
    if (!(id in stops) || !visual) return;
    event.preventDefault();
    const top = visual.getBoundingClientRect().top + window.scrollY + visual.offsetHeight * stops[id];
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  });
});

const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('[data-message]').forEach((button) => {
  button.addEventListener('click', () => {
    toast.textContent = button.dataset.message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  });
});

const exhibitionCarousel = document.querySelector('.art-cards');

if (exhibitionCarousel) {
  const carouselTrack = exhibitionCarousel.querySelector('.art-card-track');
  const carouselViewport = exhibitionCarousel.querySelector('.art-card-viewport');
  const carouselCards = [...exhibitionCarousel.querySelectorAll('.art-card')];
  const previousExhibition = exhibitionCarousel.querySelector('.carousel-prev');
  const nextExhibition = exhibitionCarousel.querySelector('.carousel-next');
  let carouselIndex = 0;
  let isDraggingCarousel = false;
  let draggedCarousel = false;
  let carouselStartX = 0;
  let carouselStartOffset = 0;
  let currentCarouselOffset = 0;
  let blockCardClick = false;

  function exhibitionsPerView() {
    return window.innerWidth <= 720 ? 1 : 3;
  }

  function carouselStepSize() {
    const firstCard = carouselCards[0];
    if (!firstCard) return 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const nextCard = carouselCards[1];
    const gap = nextCard
      ? nextCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().right
      : 0;
    return cardWidth + gap;
  }

  function lastCarouselIndex() {
    return Math.max(0, carouselCards.length - exhibitionsPerView());
  }

  function updateCarouselControls() {
    if (previousExhibition) previousExhibition.disabled = carouselIndex === 0;
    if (nextExhibition) nextExhibition.disabled = carouselIndex === lastCarouselIndex();
  }

  function renderExhibitionCarousel() {
    carouselIndex = Math.min(carouselIndex, lastCarouselIndex());
    currentCarouselOffset = -carouselIndex * carouselStepSize();
    carouselTrack.style.transform = `translateX(${currentCarouselOffset}px)`;
    updateCarouselControls();
  }

  function moveExhibitionCarousel(direction) {
    const lastIndex = lastCarouselIndex();
    carouselIndex = direction === 'next'
      ? Math.min(lastIndex, carouselIndex + 1)
      : Math.max(0, carouselIndex - 1);
    renderExhibitionCarousel();
  }

  function finishCarouselDrag() {
    if (!isDraggingCarousel) return;
    isDraggingCarousel = false;
    carouselTrack.classList.remove('is-dragging');
    const step = carouselStepSize();
    if (step) carouselIndex = Math.max(0, Math.min(lastCarouselIndex(), Math.round(-currentCarouselOffset / step)));
    renderExhibitionCarousel();
    if (draggedCarousel) {
      blockCardClick = true;
      window.setTimeout(() => { blockCardClick = false; }, 0);
    }
  }

  carouselViewport?.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    isDraggingCarousel = true;
    draggedCarousel = false;
    carouselStartX = event.clientX;
    carouselStartOffset = currentCarouselOffset;
    carouselTrack.classList.add('is-dragging');
    carouselViewport.setPointerCapture?.(event.pointerId);
  });

  carouselViewport?.addEventListener('pointermove', (event) => {
    if (!isDraggingCarousel) return;
    const dragDistance = event.clientX - carouselStartX;
    if (Math.abs(dragDistance) > 4) draggedCarousel = true;
    const furthestOffset = -lastCarouselIndex() * carouselStepSize();
    currentCarouselOffset = Math.max(furthestOffset, Math.min(0, carouselStartOffset + dragDistance));
    carouselTrack.style.transform = `translateX(${currentCarouselOffset}px)`;
  });

  carouselViewport?.addEventListener('pointerup', finishCarouselDrag);
  carouselViewport?.addEventListener('pointercancel', finishCarouselDrag);
  carouselViewport?.addEventListener('click', (event) => {
    if (!blockCardClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  previousExhibition?.addEventListener('click', () => moveExhibitionCarousel('previous'));
  nextExhibition?.addEventListener('click', () => moveExhibitionCarousel('next'));
  window.addEventListener('resize', renderExhibitionCarousel);
  renderExhibitionCarousel();
}
