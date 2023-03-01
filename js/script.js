import { API_KEY_V3, API_URL } from "./api_auth.js";

const TOP_SECTION = document.querySelector("#top-movies");
const POPULAR_SECTION = document.querySelector("#popular-movies");
const UPCOMING_SECTION = document.querySelector("#upcoming-movies");
const HEADER_SECTION = document.querySelector("#header");

let BASE_URL = new URL(API_URL);

let list_of_movies = [];

const create_search_url = (params, page) => {
  let { group, filter } = params;
  let url = new URL(BASE_URL + group + "/" + filter);
  url.searchParams.set("api_key", API_KEY_V3);
  url.searchParams.set("page", page);
  return url;
};

const get_movie_data = async (params, page) => {
  let url = create_search_url(params, page);
  const data = await fetch(url);
  const json = await data.json();
  return json;
};

const get_top_movies = async (page) => {
  return get_movie_data({ group: "movie", filter: "top_rated" }, page);
};

const get_popular_movies = async (page) => {
  return get_movie_data({ group: "movie", filter: "popular" }, page);
};

const get_upcoming_movies = async (page) => {
  return get_movie_data({ group: "movie", filter: "upcoming" }, page);
};

const map_movies = async (fn, page_nr, list) => {
  const page = await fn(page_nr);
  const movies = await page.results;
  list = [...movies];
  return list;
};

const create_card = (original_title, poster_path, overview, id) => {
  let container = document.createElement("a");
  container.className = "card";
  container.href = `http://127.0.0.1:5500/movie.html?id=${id}`;
  let image = document.createElement("img");
  image.src = "https://image.tmdb.org/t/p/w500" + poster_path;

  container.append(image);

  return container;
};

const append_element = async (list, section) => {
  list.forEach((movie) => {
    section.append(
      create_card(
        movie.original_title,
        movie.poster_path,
        movie.overview,
        movie.id
      )
    );
  });
};

const create_header = async (movies, section) => {
  const header_image = document.createElement("div");
  header_image.className = "header_image";
  header_image.style.backgroundImage = `url(${
    "https://image.tmdb.org/t/p/original" +
    movies[0].backdrop_path +
    "?" +
    API_KEY_V3
  })`;

  const fbtn = document.createElement("div");
  const bbtn = document.createElement("div");
  fbtn.innerText = ">";
  fbtn.className = "fbtn";
  bbtn.innerText = "<";
  bbtn.className = "bbtn";

  header_image.appendChild(bbtn);

  const front_drop = document.createElement("div");
  front_drop.className = "frontdrop";

  const title = document.createElement("h2");
  title.innerText = movies[0].original_title;
  title.className = "header_image_title";
  header_image.appendChild(front_drop);
  header_image.appendChild(title);
  header_image.appendChild(fbtn);

  section.append(header_image);
};

const init = async () => {
  const top_movies = await map_movies(get_top_movies, 1, list_of_movies);
  const upcoming_movies = await map_movies(
    get_upcoming_movies,
    1,
    list_of_movies
  );

  const popular_movies = await map_movies(
    get_popular_movies,
    1,
    list_of_movies
  );
  await create_header(upcoming_movies, HEADER_SECTION);
  await append_element(top_movies, TOP_SECTION);
  await append_element(popular_movies, POPULAR_SECTION);
  await append_element(upcoming_movies, UPCOMING_SECTION);
};

init();
