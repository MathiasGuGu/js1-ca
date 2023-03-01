export const create_404_page = (section) => {
  const page = `<div class="four">
    <h2>404 - page not found</h2>
    <h1>The page you were looking for does not exist</h1>
    <p>Check the name and try again</p>
    <a href="/">Back to start page</a>
  </div>`;
  section.innerHTML = page;
};
