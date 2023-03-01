import { API_KEY_V3, API_URL } from "./api_auth.js";

const MOVIE_SECTION = document.querySelector("#movies");
const MORE_BTN = document.querySelector(".btn");
const TO_TOP_BTN = document.querySelector("#to_top");
const SEARCH = document.querySelector("#search");

const TOPR = document.querySelector("#topr");
const WORSTR = document.querySelector("#worstr");

let total_movies = [];
let count = 1;
let current_scroll;

let BASE_URL = new URL(API_URL);


const create_search_url = (page) => {
  let url = new URL(BASE_URL + "discover" + "/movie");
  url.searchParams.set("api_key", API_KEY_V3);
  url.searchParams.set("page", page);
  return url;
};

const get_discover_list = async (page, list) => {
  const data = await fetch(create_search_url(page));
  const json = await data.json();

  let new_list = [...list, ...json.results];
  return new_list;
};

const create_card = (
  original_title,
  poster_path,
  overview,
  id,
  vote_average
) => {
  let container = document.createElement("a");
  container.className = "card";
  container.href = `http://127.0.0.1:5500/movie.html?id=${id}`;
  let image = document.createElement("img");
  image.alt = original_title;
  image.src = "https://image.tmdb.org/t/p/w500" + poster_path;

  let rating = document.createElement("div");
  rating.className = "rating";
  rating.innerText = vote_average;
  container.append(image);
  container.append(rating);

  return container;
};

const clear_html = async () => {
  MOVIE_SECTION.innerHTML = "";
};

const filter_arr = async (arr, text, method) => {
  let tmp_arr = arr;
  switch (method) {
    case "name":
      tmp_arr = tmp_arr.filter((el) => {
        return el.original_title.toLowerCase().includes(text.toLowerCase());
      });
      return tmp_arr;

    case "genre":
      tmp_arr = tmp_arr.filter((el) => {
        return el.original_title.toLowerCase().includes(text.toLowerCase());
      });
      return tmp_arr;

    case "rating-high":
      tmp_arr = tmp_arr.sort((el, com) => {
        return com.vote_average - el.vote_average;
      });
      return tmp_arr;

    case "rating-low":
      tmp_arr = tmp_arr.sort((el, com) => {
        return el.vote_average - com.vote_average;
      });
      return tmp_arr;

    default:
      return arr;
  }
};

const add_card = async (mov) => {
  console.log(mov);
  mov?.forEach((movie) =>
    MOVIE_SECTION.append(
      create_card(
        movie.original_title,
        movie.poster_path,
        movie.overview,
        movie.id,
        movie.vote_average
      )
    )
  );
};

const init = async () => {
  total_movies = await get_discover_list(count, total_movies);
  await ui(total_movies);
};

const ui = async (list) => {
  await add_card(list);
};
init();

MORE_BTN.addEventListener("click", async () => {
  count++;
  current_scroll = window.scrollY;
  await clear_html();
  await init(total_movies);
  await ui(total_movies);
  window.scrollTo({ top: current_scroll, left: 0 });
});

SEARCH.addEventListener("input", async (e) => {
  await clear_html();
  let arr = await filter_arr(total_movies, e.target.value, "name");
  await ui(arr);
});

TOPR.addEventListener("click", async (e) => {
  e.preventDefault();
  await clear_html();
  let arr = await filter_arr(total_movies, e.target.value, "rating-high");
  await ui(arr);
});
WORSTR.addEventListener("click", async (e) => {
  e.preventDefault();
  await clear_html();
  let arr = await filter_arr(total_movies, e.target.value, "rating-low");
  await ui(arr);
});

TO_TOP_BTN.addEventListener("click", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});
