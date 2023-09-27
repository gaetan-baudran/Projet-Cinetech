"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar, sidebarSeries } from "./sidebar.js";
import { createSeriesCard } from "./series-card.js";
import { search, searchSeries } from "./search.js";


const seriesId = window.localStorage.getItem("seriesId");
const pageContent = document.querySelector("[page-content]");


sidebarSeries();

const getGenresSeries = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
};

const getCastsSeries = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }

  return newCastList.join(", ");
};

const getCreators = function (crewList) {
  const creators = crewList.filter(({ job }) => job === "Creator");

  const creatorList = [];
  for (const { name } of creators) creatorList.push(name);

  return creatorList.join(", ");
};

const filterSeries = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${api_key}&append_to_response=credits,videos,images`,
  function (series) {
    const {
      backdrop_path,
      poster_path,
      name,
      first_air_date,
      episode_run_time,
      vote_average,
      genres,
      overview,
      id,
      credits: { cast, crew },
      videos: { results: videos },
    } = series;

console.log(id);

    document.title = `${name} `;

    const seriesDetail = document.createElement("div");
    seriesDetail.classList.add("movie-detail");

    seriesDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${imageBaseURL}${
      "w1280" || "original"
    }${backdrop_path || poster_path}')"></div>
    
    <figure class="poster-box movie-poster">
      <img src="${imageBaseURL}w342${poster_path}" alt="${name} poster" class="img-cover">
    </figure>
    
    <div class="detail-box">
    
      <div class="detail-content">
        <h1 class="heading">${name}</h1>
    
        <div class="meta-list">
    
          <div class="meta-item">
            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
    
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>
    
          <div class="separator"></div>
    
          <div class="meta-item">${episode_run_time[0]} min</div>
    
          <div class="separator"></div>
    
          <div class="meta-item">${
            first_air_date?.split("-")[0] ?? "Not Released"
          }</div>
    
        </div>
    
        <p class="genre">${getGenresSeries(genres)}</p>
    
        <p class="overview">${overview}</p>
    
        <ul class="detail-list">
    
          <div class="list-item">
            <p class="list-name">Starring</p>
    
            
          </div

          <div class="list-item">
          <p class="list-name">Created By</p>
  
          <p>${getCreators(crew)}</p>
        </div>
  
      </ul>
  
    </div>
  
    <div class="title-wrapper">
      <h3 class="title-large">Trailers and Clips</h3>
    </div>
  
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  
  </div>
`;

    for (const { key, name } of filterSeries(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      videoCard.innerHTML = `
    <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
      frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
  `;

      seriesDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(seriesDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/tv/${seriesId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedSeries
    );
  }
);

const addSuggestedSeries = function ({ results: seriesList }, title) {
  const seriesListElem = document.createElement("section");
  seriesListElem.classList.add("series-list");
  seriesListElem.ariaLabel = "You May Also Like";

  seriesListElem.innerHTML = `
  <div class="title-wrapper">
    <h3 class="title-large">You May Also Like</h3>
  </div>
  
  <div class="slider-list">
    <div class="slider-inner"></div>
  </div>
`;

  for (const series of seriesList) {
    const seriesCard = createSeriesCard(series); // call from series-card.js

    seriesListElem.querySelector(".slider-inner").appendChild(seriesCard);
  }

  pageContent.appendChild(seriesListElem);
};

searchSeries();
