'use strict';

const api_key = '001c3d9622b43276a98468e1c3f8085c';
const imageBaseURL = 'https://image.tmdb.org/t/p/';


  // fetch les données en utilisant `url` et met le résultas en json
 

const fetchDataFromServer = function (url, callback, optionalParam) {
     fetch(url)
    .then(response => response.json())
    .then(data => callback(data, optionalParam));
}

export { imageBaseURL, api_key, fetchDataFromServer };