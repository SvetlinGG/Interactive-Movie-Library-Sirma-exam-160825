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

Getting started:
1) Obtain an OMDb API key

Create a free key at https://www.omdbapi.com/apikey.aspx and activate it via the email they send.

2) Configure the key

3) Run locally (no build needed)

VS Code: install Live Server → “Open with Live Server”

HOW IT WORKS:

Search

1. Потребителят въвежда заглавие (напр. “Matrix”) и натиска Search (или Enter).

2. JS прихваща събитието submit на формата, взима стойността (q), нулира страницата на 1




3. searchMovies прави fetch към https://www.omdbapi.com/?apikey=...&s=<q>&page=<n>

Ако Response:"False" → хвърля грешка (показва се съобщение в UI).

Ако е успешно → връща Search: [] и totalResults.

4. UI:

Показва съобщение „Loading…“ докато чака отговора.

Заменя съдържанието на #resultsGrid с карти, генерирани от темплейта (cardTpl).

Изчислява общите страници: Math.ceil(totalResults/10) и активира пагинацията.
