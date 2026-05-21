const apiKey = "3ef247a2";
const main = document.getElementById("main2");

async function getMovies() {
  const resp = await fetch(
    `https://www.omdbapi.com/?s=all&apikey=${apiKey}&page=1`,
  );
  const data = await resp.json();
  //
  //

  const resp_2 = await fetch(
    `https://www.omdbapi.com/?s=all&apikey=${apiKey}&page=7`,
  );
  const data_2 = await resp_2.json();
  //
  //

  const resp_3 = await fetch(
    `https://www.omdbapi.com/?s=all&apikey=${apiKey}&page=8`,
  );
  const data_3 = await resp_3.json();

  const resp_4 = await fetch(
    `https://www.omdbapi.com/?s=all&apikey=${apiKey}&page=9`,
  );
  const data_4 = await resp_4.json();
  //
  //
  let movies_list = [
    ...data.Search,
    ...data_2.Search,
    ...data_3.Search,
    ...data_4.Search,
  ];
  //
  //
  movies_list.forEach((element) => {
    const div = document.createElement("div");

    div.innerHTML = `

<img src="${element.Poster}"width="100%">`;

    main.appendChild(div);
  });
}

getMovies();
