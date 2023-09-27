"use strict";

/**
 *  importe toutes les composant et fonctions
 */

import { sidebar, sidebarSeries } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { createSeriesCard } from "./series-card.js";
import { search, searchSeries } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

/**
 * Section page d'acceuil (Top rated, Upcoming, Trending movies)
 */

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

/**
 * fetch tout les genres eg: [ { "id": "123", "name": "Action" } ]
 * puis change genre format eg: { 123: "Action" }
 */
const genreList = {
  // créer genre en string depuis genre_id eg: [23, 43] -> "Action, Romance".
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); // this == genreList;
    }

    return newGenreList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList, seriesList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>
    
    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${
      index === 0 ? "eager" : "lazy"
    }>
      
      <div class="banner-content">
      
        <h2 class="heading">${title}</h2>
      
        <div class="meta-list">
          <div class="meta-item">${
            release_date?.split("-")[0] ?? "Not Released"
          }</div>
      
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
      
        <p class="genre">${genreList.asString(genre_ids)}</p>
      
        <p class="banner-text">${overview}</p>
      
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
      
          <span class="span">Watch Now</span>
        </a>
      
      </div>
    `;
    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();

  /**
   * fetch les données pour la section page d'acceuil (top rated, upcoming, trending)
   */
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

/**
 * Hero slider fonctionnalité
 */

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    // `this` == slider-control
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

// Créer une liste de films
const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // appeler depuis movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

search();

// ----SERIES-----

sidebarSeries();

const homePageSectionsSeries = [
  {
    title: "Popular Series",
    path: "/tv/popular",
  },
  {
    title: "Top Rated Series",
    path: "/tv/top_rated",
  },
];

const genreListSeries = {};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/tv/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreListSeries[id] = name;
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=1`,
      heroBannerSeries
    );
  }
);

// const heroBannerSeries = function ({ results: seriesList }) {
//   const banner = document.createElement("section");
//   banner.classList.add("banner");
//   banner.ariaLabel = "Popular Series";

//   banner.innerHTML = `
//     <div class="banner-slider"></div>

//      <div class="slider-control">
//       <div class="control-inner"></div>
//      </div>
//    `;
  

//   let controlItemIndex = 0;

//   for (const [index, series] of seriesList.entries()) {
//     const {
//       backdrop_path,
//       name,
//       first_air_date,
//       genre_ids,
//       overview,
//       poster_path,
//       vote_average,
//       id,
//     } = series;

//     const sliderItem = document.createElement("div");
//     sliderItem.classList.add("slider-item");
//     sliderItem.setAttribute("slider-item", "");

//     sliderItem.innerHTML = `
//       <img src="${imageBaseURL}w1280${backdrop_path}" alt="${name}" class="img-cover" loading=${
//       index === 0 ? "eager" : "lazy"
//     }>
      
//       <div class="banner-content">
      
//         <h2 class="heading">${name}</h2>
      
//         <div class="meta-list">
//           <div class="meta-item">${
//             first_air_date?.split("-")[0] ?? "Not Released"
//           }</div>
      
//           <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
//         </div>
      
//         <p class="genre">${genre_ids
//           .map((genreId) => genreListSeries[genreId])
//           .join(", ")}</p>
      
//         <p class="banner-text">${overview}</p>
      
//         <a href="./detail2.html" class="btn" onclick="getSeriesDetail(${id})">
//           <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
      
//           <span class="span">Watch Now</span>
//         </a>
      
//       </div>
//     `;
//     banner.querySelector(".banner-slider").appendChild(sliderItem);

//     const controlItem = document.createElement("button");
//     controlItem.classList.add("poster-box", "slider-item");
//     controlItem.setAttribute("slider-control", `${controlItemIndex}`);

//     controlItemIndex++;

//     controlItem.innerHTML = `
//       <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${name}" loading="lazy" draggable="false"
//       lass="img-cover">
//       `;
//     banner.querySelector(".control-inner").appendChild(controlItem);
//   }

//   pageContent.appendChild(banner);

//   addHeroSlideSeries();

//   for (const { title, path } of homePageSectionsSeries) {
//     fetchDataFromServer(
//       ` https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
//       (data) => createSeriesList(data, title)
//     );
//   }
// };

// const addHeroSlideSeries = function () {
//   const sliderItems = document.querySelectorAll("[slider-item]");
//   const sliderControls = document.querySelectorAll("[slider-control]");

//   let lastSliderItem = sliderItems[0];
//   let lastSliderControl = sliderControls[0];

//   lastSliderItem.classList.add("active");
//   lastSliderControl.classList.add("active");

//   const sliderStart = function () {
//     lastSliderItem.classList.remove("active");
//     lastSliderControl.classList.remove("active");

//     // `this` == slider-control
//     sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
//       "active"
//     );
//     this.classList.add("active");

//     lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
//     lastSliderControl = this;
//   };

//   addEventOnElements(sliderControls, "click", sliderStart);
// };

//   const sliderItems = document.querySelectorAll("[slider-item]");
//   const sliderControls = document.querySelectorAll("[slider-control]");
//   let lastSliderItem = sliderItems[0];
//   let lastSliderControl = sliderControls[0];

//   lastSliderItem.classList.add("active");
//   lastSliderControl.classList.add("active");

//   const sliderStart = function () {
//     lastSliderItem.classList.remove("active");
//     lastSliderControl.classList.remove("active");

//     const sliderIndex = Number(this.getAttribute("slider-control"));
//     sliderItems[sliderIndex].classList.add("active");
//     sliderControls[sliderIndex].classList.add("active");

//     lastSliderItem = sliderItems[sliderIndex];
//     lastSliderControl = sliderControls[sliderIndex];
//   };

//   addEventOnElements(sliderControls, "click", sliderStart);

const createSeriesList = function (data, title) {
  const { results: seriesList } = data;

  const seriesListElem = document.createElement("section");
  seriesListElem.classList.add("series-list");
  seriesListElem.setAttribute("aria-label", title);

  seriesListElem.innerHTML = `
  <div class="title-wrapper">
    <h3 class="title-large">${title}</h3>
  </div>
  <div class="slider-list">
    <div class="slider-inner"></div>
  </div>
`;
  console.log(seriesList);
  for (const series of seriesList) {
    const seriesCard = createSeriesCard(series);
    seriesListElem.querySelector(".slider-inner").appendChild(seriesCard);
  }

  pageContent.appendChild(seriesListElem);
};

searchSeries();
