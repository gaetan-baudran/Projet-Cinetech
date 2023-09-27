"use strict";

/**
 * Ajout des events sur plusieurs elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
};

/**
 * barre de recherche pour mobile || small screen
 */

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});

//  Prend le film en question quand on clique sur la card

const getMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
};


// -------- Series --------

// Prend la série en question quand on clique sur la card

const getSeriesDetail = function (seriesId) {
  window.localStorage.setItem("seriesId", String(seriesId));
};

const getSeriesList = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
};
