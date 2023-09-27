// ---------- SERIES -------------

"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebarSeries } from "./sidebar.js";
import { createSeriesCard } from "./series-card.js";
import { search } from "./search.js";

// Collect genre name & URL parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[page-content]");

sidebarSeries();

let currentPage = 1;
let totalPages = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&sort_by=popularity.desc&page=${currentPage}&${urlParam}`,
  function ({ results: seriesList, total_pages }) {
    totalPages = total_pages;

    document.title = `${genreName} Series `;

    const seriesListElem = document.createElement("section");
    seriesListElem.classList.add("series-list", "genre-list");
    seriesListElem.ariaLabel = `${genreName} Series`;

    seriesListElem.innerHTML = `
    <div class="title-wrapper">
      <h1 class="heading">All ${genreName} Series</h1>
    </div>
    
    <div class="grid-list"></div>
    
    <button class="btn load-more" load-more>Load More</button>
  `;

    /**
     * Add series card based on fetched items
     */
    for (const series of seriesList) {
      const seriesCard = createSeriesCard(series);

      seriesListElem.querySelector(".grid-list").appendChild(seriesCard);
    }

    pageContent.appendChild(seriesListElem);

    /**
     * Load more with "load more" button functionality
     */
    document
      .querySelector("[load-more]")
      .addEventListener("click", function () {
        if (currentPage >= totalPages) {
          this.style.display = "none"; // this == loading-btn
          return;
        }

        currentPage++;
        this.classList.add("loading"); // this == loading-btn

        fetchDataFromServer(
          `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&sort_by=popularity.desc&page=${currentPage}&${urlParam}`,
          ({ results: seriesList }) => {
            this.classList.remove("loading"); // this == loading-btn
            console.log(seriesList);
            
            for (const series of seriesList) {
              const seriesCard = createSeriesCard(series);

              seriesListElem
                .querySelector(".grid-list")
                .appendChild(seriesCard);
            }
          }
        );
      });
  }
);

search();
