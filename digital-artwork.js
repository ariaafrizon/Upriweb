const digitalWorks = [
  { title: 'Homecoming', image: 'assets/digital-art/pulang-kampung.png', fullImage: 'assets/highres/digital/pulang-kampung.jpg' },
  { title: 'Walk Cycling', image: 'assets/digital-art/walk-cycling.png', fullImage: 'assets/highres/digital/walk-cycling.jpg' },
  { title: 'Pressured', image: 'assets/digital-art/dituntut.png', fullImage: 'assets/highres/digital/dituntut.jpg' },
  { title: 'Acceleration', image: 'assets/digital-art/acceleration.png', fullImage: 'assets/highres/digital/acceleration.jpg' }
];

const digitalShowcase = document.querySelector('.digital-showcase');
if (digitalShowcase) {
  const image = digitalShowcase.querySelector('.digital-stage img');
  const stage = digitalShowcase.querySelector('.digital-stage');
  const title = digitalShowcase.querySelector('.digital-copy h2');
  const count = digitalShowcase.querySelector('.digital-count');
  let currentWork = 0;

  function showDigitalWork(nextIndex) {
    currentWork = (nextIndex + digitalWorks.length) % digitalWorks.length;
    const work = digitalWorks[currentWork];
    image.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = work.image;
      image.alt = `${work.title} digital artwork by Uprijon`;
      stage.setAttribute('aria-label', `Open ${work.title} full-size artwork`);
      title.textContent = work.title;
      count.textContent = `${currentWork + 1} / ${digitalWorks.length}`;
      image.classList.remove('is-changing');
    }, 160);
  }

  digitalShowcase.querySelector('.digital-prev').addEventListener('click', () => showDigitalWork(currentWork - 1));
  digitalShowcase.querySelector('.digital-next').addEventListener('click', () => showDigitalWork(currentWork + 1));
  stage.addEventListener('click', () => {
    const work = digitalWorks[currentWork];
    window.upriwebLightbox?.open(work.fullImage, `${work.title} digital artwork by Uprijon`, work.title);
  });
}
