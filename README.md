# Uprijon website prototype

The latest responsive redesign has been reverted. The prior Home and About layouts are restored, with the translucent noise profile panel retained.

Open `index.html` in a browser. The artwork is rendered from the supplied PSD with its editable UI text layers removed. The hero `UPRIJON` wordmark is intentionally retained inside the hero artwork so it remains visually integrated behind the character. Navigation, headings, buttons, card labels, descriptions, profile copy, and copyright are real HTML text styled in CSS with Poppins.

Hover and keyboard-focus states are included for navigation, menu items, cards, social links, and buttons. After the visitor scrolls down, the desktop navigation reduces to a thin black bar and expands again on hover or keyboard focus.

The Home hero includes an original three-track hip-hop player generated in the browser with the Web Audio API. It does not load YouTube, third-party streams, or copyrighted recordings. Visitors can switch beats, pause playback, and control the volume from the floating player. The `THE DREAMER KIDS` heading is right-aligned precisely with the music button.

The supplied `face 1.png` character artwork is installed as the favicon on every page. The project includes `.ico`, 32 × 32, 192 × 192, Apple touch, and 512 × 512 versions for browser tabs, bookmarks, mobile shortcuts, and an eventual HTTPS deployment.

The hero flowers are transparent PSD exports animated with a slow, continuous clockwise CSS rotation. This keeps them sharp at every screen size and avoids a heavy GIF asset.

The purple illustration in the story section is also reconstructed from separate PSD layers and floats slowly up and down. The story title is extra-bold; its paragraph is justified, and its rounded dark call-to-action is editable HTML/CSS.

The Home NFT section restores the PSD texture with soft-light blending. Its three cards are rebuilt as single editable components (frame, character art, copy, and arrow), preventing background/CSS duplicates. The accompanying character drifts in both axes, the flower rotates, and the bubble illustrations float gently. The section now uses a concise English introduction to the Uprijon universe, and every NFT navigation link opens the dedicated roadmap page.

The Exhibition area is rebuilt as two layered CSS ticker ribbons with continuous right-to-left loops. The foreground ribbon has a shadow; the lower rear ribbon slopes down to the right, with its bold text vertically centered in the rear ribbon and intentionally partially covered by the foreground ribbon. Duplicated ticker content makes the loop seamless, with no blank delay. The PSD eye illustration is restored as an overlay above both ribbons and has a slow, irregular floating motion. Seven editable exhibition cards are displayed three at a time in a previous/next carousel; it stops at either end, disables the unavailable arrow, and supports horizontal pointer/touch dragging in either direction. The image, card surface, headline, description, and hover animation move as one unit.

Artwork-integrated lettering—such as decorative logo marks printed inside an illustration—remains part of the artwork asset. It can be replaced with editable copy if a matching font or original vector logo is supplied.

## About page
Open index.html and select About, or open about.html directly. Both desktop and mobile navigation link to the new page. The biography, artist statement, and nine exhibition entries are editable HTML. Original PSD illustrations are exported as WebP in assets/bio. about.css controls the responsive About layout. This is the local working version; no live deployment was performed.

## Artwork pages

Hover Artwork in the desktop navigation to open Manual Artwork and Digital Artwork. `manual-artwork.html` rebuilds the supplied `Upriweb_Artwork.psd` as 12 individual artwork cards. Only the paintings are exported from the PSD; borders, labels, status badges, and hover states are HTML/CSS, so the card treatment is never doubled.

Selecting a manual artwork opens its detail panel. Available works continue to a checkout form that sends the artwork and buyer details to `ariaafrizon@gmail.com` with the subject `Buy a painting from Uprijon` through FormSubmit. FormSubmit sends a one-time activation email to that address after the first submission; the address owner must activate the endpoint before later messages are forwarded normally.

`digital-artwork.html` uses the four artworks and carousel layout found in `Upriweb_Artwork digital.psd`, so the second dropdown item has a working destination.

Artwork images in the Digital carousel and the image inside each Manual detail panel open in a fullscreen lightbox. These previews load high-resolution source files extracted from the PSD Smart Objects only when opened; clicking the fullscreen image toggles between fit-to-screen and its native pixel size.

## Events pages

`events.html` lists seven events taken from the folders in `Event blog`. The layout follows the supplied thumbnail/detail references for information structure, while retaining Uprijon's black, lime, illustrated visual language. Each See More link opens `event-detail.html` with the selected event's hero, placeholder story, photo gallery, and previous/next navigation. Event copy is centralized in `events-data.js` so the placeholder writing can be replaced without rebuilding the layout.

The Home exhibition carousel still uses its existing card component. Its seven cards now use the event photographs, headlines, and summaries, and each card opens the corresponding full event article. Every primary navigation now labels the destination as Events.

## NFT roadmap page

`nft.html` presents the Upriworld logo and the complete roadmap in English. It covers the five parts of the Uprijon universe, ten ecosystem phases, four holder tiers, the business engine, and the seven narrative chapters from Genesis to The World Comes Alive. The page uses the site's black, lime, cream, doodle, and illustrated visual language while keeping all roadmap content editable in HTML. Its hero character uses the original 1080 × 1080 smart-object asset extracted from `Upriweb.psd`; the Seven Chapters grid fades softly into the background at both edges.

Every page shares the same clean green footer with an inset frame, left-aligned Uprijon identity, and circular social links. The previous footer character illustration has been removed from all pages.

All visible interface copy across Home, About, Artwork, Events, and NFT pages is in English, including artwork titles, purchase form labels, status messages, and accessibility labels.
