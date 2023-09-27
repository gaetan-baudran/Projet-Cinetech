"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {
  /**
   * fetch tout les genres eg: [ { "id": "123", "name": "Action" } ]
   * puis change genre en format eg: { 123: "Action" }
   */
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
    
      <p class="title">Genre Movies</p>
    
    </div>
    
    <div class="sidebar-list">
    
      <p class="title">Language</p>
    
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=en", "English")'>English</a>
    
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=fr", "French")'>French</a>
    
     
    
    </div>
    
    <div class="sidebar-footer">

    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = function (sidebar) {
    /**
     * Toggle sidebar en écran mobile
     */

    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}

// ------------ SERIES ----------------

export function sidebarSeries() {
  /**
   * fetch all genres e.g., [ { "id": "123", "name": "Action" } ]
   * then convert genres to the format e.g., { 123: "Action" }
   */
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${api_key}`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
    
      <p class="title">Genre Séries</p>
    
    </div>
    
    <div class="sidebar-list">
    
      <p class="title">Language</p>
    
      <a href="./series-list.html" menu-close class="sidebar-link"
        onclick='getSeriesList("with_original_language=en", "English Series")'>English Series</a>
    
      <a href="./series-list.html" menu-close class="sidebar-link"
        onclick='getSeriesList("with_original_language=fr", "French Series")'>French Series</a>
    
     
    
    </div>
    
    <div class="sidebar-footer">
      <p class="copyright">
        Gaetan Baudran</a>
      </p>
    
      <img src="./assets/images/tmdb-logo.svg" width="130" height="17" alt="the movie database logo">
    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./series-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getSeriesList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = function (sidebar) {
    /**
     * Toggle sidebar on mobile screens
     */

    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}
