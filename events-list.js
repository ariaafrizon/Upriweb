const eventsList = document.querySelector('#events-list');
const events = window.UPRIJON_EVENTS || [];

if (eventsList) {
  eventsList.innerHTML = events.map((event, index) => `
    <article class="event-list-card">
      <a class="event-list-image" href="event-detail.html?event=${encodeURIComponent(event.slug)}" aria-label="Read ${event.title}">
        <img src="${event.thumbnail}" alt="${event.title}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
        <span>${String(index + 1).padStart(2, '0')}</span>
      </a>
      <div class="event-list-copy">
        <p>${event.category}</p>
        <h2><a href="event-detail.html?event=${encodeURIComponent(event.slug)}">${event.title}</a></h2>
        <div>${event.summary}</div>
        <time datetime="${event.datetime}">${event.dateLabel}</time>
        <a class="event-read-more" href="event-detail.html?event=${encodeURIComponent(event.slug)}">See More <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `).join('');
}
