const artworkCards = [...document.querySelectorAll('.manual-art-card')];
const detailDialog = document.querySelector('.art-detail-dialog');
const checkoutDialog = document.querySelector('.checkout-dialog');
const purchaseForm = document.querySelector('.purchase-form');
let selectedArtwork = null;
let lastArtworkTrigger = null;

function setDialogState() {
  document.body.classList.toggle('has-dialog-open', Boolean(detailDialog?.open || checkoutDialog?.open));
}

function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
}

function fillArtworkDetail(card) {
  if (!detailDialog) return;
  selectedArtwork = {
    title: card.dataset.title,
    medium: card.dataset.medium,
    size: card.dataset.size,
    year: card.dataset.year,
    status: card.dataset.status,
    category: card.dataset.category,
    price: card.dataset.price,
    image: card.querySelector('img')?.src || '',
    fullImage: card.dataset.full || card.querySelector('img')?.src || ''
  };

  const detailImage = detailDialog.querySelector('.art-detail-visual img');
  detailImage.src = selectedArtwork.image;
  detailImage.alt = `${selectedArtwork.title} painting by Uprijon`;
  detailDialog.querySelector('#detail-title').textContent = selectedArtwork.title;
  detailDialog.querySelector('.detail-year').textContent = `Original work, ${selectedArtwork.year}`;
  detailDialog.querySelector('.detail-medium').textContent = selectedArtwork.medium;
  detailDialog.querySelector('.detail-size').textContent = selectedArtwork.size;
  detailDialog.querySelector('.detail-category').textContent = selectedArtwork.category;
  detailDialog.querySelector('.detail-status').textContent = selectedArtwork.status;
  detailDialog.querySelector('.detail-price').textContent = selectedArtwork.price;

  const buyButton = detailDialog.querySelector('.buy-now-button');
  const isSold = selectedArtwork.status === 'SOLD';
  buyButton.disabled = isSold;
  buyButton.textContent = isSold ? 'Artwork Sold' : 'Buy Now';
}

artworkCards.forEach((card) => {
  card.addEventListener('click', () => {
    lastArtworkTrigger = card;
    fillArtworkDetail(card);
    detailDialog?.showModal();
    setDialogState();
  });
});

document.querySelectorAll('dialog .dialog-close').forEach((button) => {
  button.addEventListener('click', () => closeDialog(button.closest('dialog')));
});

[detailDialog, checkoutDialog].forEach((dialog) => {
  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (isBackdrop) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    setDialogState();
    if (!detailDialog?.open && !checkoutDialog?.open) lastArtworkTrigger?.focus();
  });
});

detailDialog?.querySelector('.buy-now-button')?.addEventListener('click', () => {
  if (!selectedArtwork || selectedArtwork.status === 'SOLD' || !checkoutDialog || !purchaseForm) return;
  purchaseForm.elements.artwork.value = `${selectedArtwork.title} — ${selectedArtwork.medium}, ${selectedArtwork.size}, ${selectedArtwork.year}`;
  checkoutDialog.querySelector('.summary-artwork').textContent = `${selectedArtwork.title} × 1`;
  checkoutDialog.querySelectorAll('.summary-price').forEach((node) => { node.textContent = selectedArtwork.price; });
  detailDialog.close();
  checkoutDialog.showModal();
  setDialogState();
});

detailDialog?.querySelector('.zoom-image-button')?.addEventListener('click', () => {
  if (!selectedArtwork) return;
  window.upriwebLightbox?.open(selectedArtwork.fullImage, `${selectedArtwork.title} artwork by Uprijon`, selectedArtwork.title);
});

purchaseForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = purchaseForm.querySelector('.submit-order');
  const status = purchaseForm.querySelector('.form-status');
  const formData = new FormData(purchaseForm);
  const payload = Object.fromEntries(formData.entries());

  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  status.classList.remove('is-error');
  status.textContent = 'Sending your order…';

  try {
    const response = await fetch('https://formsubmit.co/ajax/ariaafrizon@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || result.success === false) throw new Error(result.message || 'Unable to submit order');
    status.textContent = 'Your order was sent. The Uprijon team will contact you.';
    purchaseForm.reset();
    purchaseForm.elements.artwork.value = payload.artwork;
  } catch (error) {
    status.classList.add('is-error');
    status.textContent = 'Your order could not be sent. Check your connection and try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Place Order';
  }
});
