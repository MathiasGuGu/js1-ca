const NAV_SEARCH = document.querySelector("#nav-search");
const NAV_SEARCH_BTN = document.querySelector("#nav-search-btn");
const NAV_FORM = document.querySelector("#nav-form");
const DROPDOWN_SEARCH = document.querySelector("#dropdown_search");

import { API_KEY_V3, API_URL } from "../api_auth.js";

let BASE_URL = new URL(API_URL);

const create_search_url = (params, page) => {
  let { group, filter } = params;
  let url = new URL(BASE_URL + group + "/" + filter);
  url.searchParams.set("api_key", API_KEY_V3);
  url.searchParams.set("page", page);
  return url;
};

const create_dropdown = async (list) => {
  DROPDOWN_SEARCH.innerHTML = "";
  DROPDOWN_SEARCH.style.display = "flex";
  list.forEach((movie) => {
    const card = document.createElement("a");
    card.href = `/movie.html?id=${movie.id}`;
    card.className = "search_card";
    const card_text = document.createElement("p");
    card_text.innerText = movie.original_title;
    const card_image = document.createElement("img");
    card_image.src = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
    card.append(card_image);
    card.append(card_text);
    DROPDOWN_SEARCH.append(card);
  });
};

let search_string = "";

NAV_SEARCH.addEventListener("input", async (e) => {
  search_string = e.target.value;
  let url = create_search_url({ group: "search", filter: "movie" }, 1);
  url.searchParams.set("query", search_string);
  url = encodeURI(url);
  const movie = await fetch(url);
  const data = await movie.json();
  create_dropdown(data.results);
  NAV_SEARCH.onkeydown = async function (e) {
    if (e.keyCode === 13) {
      window.location.assign(`/movie.html?id=${data.results[0].id}`);
    }
  };
});

window.addEventListener("click", async () => {
  DROPDOWN_SEARCH.innerHTML = "";
  DROPDOWN_SEARCH.style.display = "none";
});

NAV_SEARCH.addEventListener("focus", () => {});

NAV_SEARCH_BTN.addEventListener("click", async (e) => {
  e.preventDefault();
});
