const fullImageDialog = document.querySelector('.full-image-dialog');

if (fullImageDialog) {
  const fullImage = fullImageDialog.querySelector('.full-image-canvas img');
  const fullImageTitle = fullImageDialog.querySelector('.full-image-title');
  const fullImageCanvas = fullImageDialog.querySelector('.full-image-canvas');
  let lightboxTrigger = null;

  function updateBodyDialogState() {
    document.body.classList.toggle('has-dialog-open', Boolean(document.querySelector('dialog[open]')));
  }

  function closeFullImage() {
    if (fullImageDialog.open) fullImageDialog.close();
  }

  window.upriwebLightbox = {
    open(src, alt, title) {
      lightboxTrigger = document.activeElement;
      fullImage.src = src;
      fullImage.alt = alt;
      fullImageTitle.textContent = title;
      fullImage.classList.remove('is-actual-size');
      fullImageDialog.showModal();
      updateBodyDialogState();
    }
  };

  fullImageDialog.querySelector('.full-image-close').addEventListener('click', closeFullImage);
  fullImageCanvas.addEventListener('click', (event) => {
    if (event.target === fullImage) {
      fullImage.classList.toggle('is-actual-size');
      return;
    }
    closeFullImage();
  });
  fullImageDialog.addEventListener('click', (event) => {
    if (event.target === fullImageDialog) closeFullImage();
  });
  fullImageDialog.addEventListener('close', () => {
    fullImage.src = '';
    fullImage.classList.remove('is-actual-size');
    updateBodyDialogState();
    lightboxTrigger?.focus();
  });
}
