const eventArticle = document.querySelector('#event-article');
const allEvents = window.UPRIJON_EVENTS || [];
const requestedEvent = new URLSearchParams(window.location.search).get('event');
const eventIndex = Math.max(0, allEvents.findIndex((item) => item.slug === requestedEvent));
const currentEvent = allEvents[eventIndex];

if (eventArticle && currentEvent) {
  const previousEvent = allEvents[(eventIndex - 1 + allEvents.length) % allEvents.length];
  const nextEvent = allEvents[(eventIndex + 1) % allEvents.length];
  document.title = `${currentEvent.title} — Uprijon`;

  const gallery = currentEvent.images.map((image, index) => `
    <figure class="event-gallery-item${index === 0 ? ' is-featured' : ''}">
      <img src="${image}" alt="${currentEvent.shortTitle} event documentation ${index + 1}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
      <figcaption>${index === 0 ? 'A moment from the event.' : `Event documentation ${String(index + 1).padStart(2, '0')}.`}</figcaption>
    </figure>
  `).join('');

  const sections = currentEvent.sections.map((section, index) => `
    <section class="event-story-section">
      <p>${String(index + 1).padStart(2, '0')}</p>
      <div><h2>${section.title}</h2><p>${section.body}</p></div>
    </section>
  `).join('');

  eventArticle.innerHTML = `
    <header class="event-detail-hero">
      <img src="${currentEvent.hero}" alt="${currentEvent.title}" fetchpriority="high">
      <div class="event-detail-overlay"></div>
      <div class="event-detail-heading">
        <p>${currentEvent.category}</p>
        <h1>${currentEvent.title}</h1>
        <div>${currentEvent.summary}</div>
        <time datetime="${currentEvent.datetime}">${currentEvent.dateLabel}</time>
      </div>
    </header>
    <div class="event-story-shell">
      <aside class="event-story-aside"><a href="events.html">← All Events</a><span>UPRIJON ARCHIVE</span></aside>
      <div class="event-story-content">
        <p class="event-story-intro">${currentEvent.intro}</p>
        ${sections}
        <section class="event-gallery" aria-label="${currentEvent.title} photo gallery">${gallery}</section>
      </div>
    </div>
    <nav class="event-detail-pagination" aria-label="Other events">
      <a href="event-detail.html?event=${encodeURIComponent(previousEvent.slug)}"><span>← Previous Event</span><strong>${previousEvent.shortTitle}</strong></a>
      <a href="events.html" aria-label="Back to all events"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></a>
      <a href="event-detail.html?event=${encodeURIComponent(nextEvent.slug)}"><span>Next Event →</span><strong>${nextEvent.shortTitle}</strong></a>
    </nav>
  `;
}
