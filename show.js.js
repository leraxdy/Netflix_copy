const apiKey = "3ef247a2";
const main2 = document.getElementById("main2");
async function movies() {
  const resp = await fetch(`https://www.omdbapi.com/?s=show&apikey=${apiKey}`);
  const data = await resp.json();
  console.log(data.Search);

  const resp2 = await fetch(
    `https://www.omdbapi.com/?s=show&apikey=${apiKey}&page=2`,
  );
  const data2 = await resp2.json();

  const resp3 = await fetch(
    `https://www.omdbapi.com/?s=show&apikey=${apiKey}&page=3`,
  );
  const data3 = await resp3.json();
  ///LIST
  const movieList = [...data.Search, ...data2.Search, ...data3.Search];
  console.log(movieList);
  ////
  ////
  ////

  //FOREACH
  movieList.forEach((el) => {
    const divEl = document.createElement("div");

    divEl.innerHTML = `
<img  src ="${el.Poster}" width="100%" >`;

    main.appendChild(divEl);
  });
}

movies();
