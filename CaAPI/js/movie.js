import { API_KEY_V3, API_URL } from "./api_auth.js";
import { create_404_page } from "./util/404.js";

const BODY = document.querySelector("#page");
const SIMILAR_SECTION = document.querySelector("#similar");
const ID = window.location.href.split("?")[1].split("=")[1];
const similar_url = new URL(API_URL + "movie/" + ID + "/similar");
const url = new URL(API_URL + "movie/" + ID);
url.searchParams.set("api_key", API_KEY_V3);
similar_url.searchParams.set("api_key", API_KEY_V3);

const get_movie_data = async (id) => {
  const data = await fetch(url);
  const json = await data.json();
  console.log(json);
  return json;
};

const get_similar_movies = async () => {
  const data = await fetch(similar_url);
  const json = await data.json();
  console.log(json);
  return json;
};

const create_page = (
  backdrop_path,
  budget,
  poster_path,
  overview,
  original_title
) => {
  const header_image = document.createElement("img");
  header_image.src = "https://image.tmdb.org/t/p/original" + backdrop_path;

  const container = document.createElement("div");

  const h1 = document.createElement("h1");
  h1.innerText = original_title;

  const text = document.createElement("p");
  text.innerText = overview;

  container.append(header_image, h1, text);
  BODY.append(container);
};
const create_card = (original_title, poster_path, overview, id) => {
  let container = document.createElement("a");
  container.className = "card";
  container.href = `http://127.0.0.1:5500/movie.html?id=${id}`;
  let image = document.createElement("img");
  image.alt = original_title;
  image.src = "https://image.tmdb.org/t/p/w500" + poster_path;

  container.append(image);

  return container;
};

const populate_similar = async (data) => {
  data.forEach((e) => {
    SIMILAR_SECTION.append(
      create_card(e.original_title, e.poster_path, e.overview, e.id)
    );
  });
};

const init = async () => {
  if (!ID) {
    console.log("no data");
    create_404_page(BODY);
    return;
  }
  const movie_data = await get_movie_data(ID);
  const similar_data = await get_similar_movies();
  populate_similar(similar_data.results);
  create_page(
    movie_data.backdrop_path,
    movie_data.budget,
    movie_data.poster_path,
    movie_data.overview,
    movie_data.original_title
  );
};

init();
