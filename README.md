# Interactive-Movie-Library-Sirma-exam-160825

Interactive Movie Library

Search movies, view details, paginate results, and save favorites — all in a single-page app built with HTML, CSS, and JavaScript using the OMDb API.

Live demo: https://active-movie-library.netlify.app
Tech: Vanilla JS · OMDb API · Responsive CSS (desktop, tablet ≤1170px, phones ≤600px) · LocalStorage

Features

🔎 Search movies/series by title

📄 Movie details in a modal (Title/Year/Genre/Actors/Plot/Rating)

📚 Favorites (watchlist) stored in localStorage

⏭️ Pagination (10 results/page via OMDb)

📱 Responsive UI: desktop → tablet (≤1170px) → phones (≤600px), including full-bleed background fix on mobile

⚠️ Empty/error states (no input, API errors, missing posters)

Project structure
.
├── index.html
├── style.css
└── src/
    ├── app.js        # UI logic, rendering, events, pagination, favorites
    └── api.js        # Thin OMDb wrapper (fetch + error handling)
