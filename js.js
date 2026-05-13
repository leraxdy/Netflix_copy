const apiKey = "3ef247a2";
const cont = document.getElementById("twshows");
const categ = document.getElementById("categ");

async function catMovie() {
  const resp = await fetch(`https://www.omdbapi.com/?s=movie&apikey=${apiKey}`);
  const data = await resp.json();

  const arr = [];

  data.Search.forEach((el) => {
    const div = document.createElement("div");
    div.classList.add("catBox");
    div.style.backgroundImage = `url("${el.Poster}")`;
    div.innerHTML = `
    <p>${el.Title}</p>
    
    
    `;
    categ.appendChild(div);
  });

  console.log(arr);
}
catMovie();

async function films() {
  const response = await fetch(
    `https://www.omdbapi.com/?s=show&apikey=${apiKey}`,
  );
  const data = await response.json();

  if (data.Response === "True") {
    data.Search.forEach((el) => {
      const div = document.createElement("div");
      div.style.width = "300px";
      div.classList.add("box");
      div.innerHTML = `    
        <p>${el.Title}</p>
        <p>${el.Year}</p>
        <img src="${el.Poster}" style="width:100px;">`;

      cont.appendChild(div);
    });
  }
}

films();
const movie1 = document.getElementById("movie1"); //movie list horror

async function horror() {
  const resp = await fetch(
    `https://www.omdbapi.com/?s=horror&apikey=${apiKey}`,
  );
  const data = await resp.json();

  data.Search.forEach((el) => {
    const div = document.createElement("div");
    div.style.height = "300px";
    div.classList.add("box2");

    div.innerHTML = `
    <p>${el.Title}</p>
    `;
    div.style.backgroundImage = `url("${el.Poster}")`;

    movie1.appendChild(div);
  });
}

horror();

const movie2 = document.getElementById("movie2"); ///movie new arrival list
async function newArrival() {
  const resp = await fetch(`https://www.omdbapi.com/?s=new&apikey=${apiKey}`);
  const data = await resp.json();

  data.Search.forEach((el) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <p>${el.Title}</p>
    
    
    `;
    div.classList.add("box3");
    div.style.backgroundImage = `url("${el.Poster}")`;
    console.log(el);
    movie2.appendChild(div);
  });
}

newArrival();

const searchInput = document.getElementById("searchInput"); // input search
const searchInp = document.getElementById("searchInp"); //SEARCH LOGO

searchInp.addEventListener("click", function () {
  const query = searchInput.value.trim();

  searchMovies(query);

  if (query === "") {
    searchMovies(query);
  }

});

const main = document.querySelector("main");

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
  const query = searchInput.value.trim();

    if (query !== "") {
      searchMovies(query);
    }
  }

 
});

async function searchMovies(query) {
  const resp = await fetch(
    `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`,
  );
  const data = await resp.json();

  main.innerHTML = `<h3>Results for: ${query}</h3><div id="searchResults" class="tvShows"></div>`;
  const resultsDiv = document.getElementById("searchResults");

  if (data.Response === "True") {
    data.Search.forEach((el) => {
      const div = document.createElement("div");
      div.classList.add("box2");
      div.style.backgroundImage = `url("${el.Poster !== "N/A" ? el.Poster : ""}")`;
      div.style.height = "300px";
      div.style.width = "250px";

      div.innerHTML = `<p>${el.Title}</p>`;
      resultsDiv.appendChild(div);
    });
  } else {
    resultsDiv.innerHTML = `<p style="color:white; margin-left: 20px;">No movies found for "${query}"</p>`;
  }
}
