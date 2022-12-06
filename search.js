let searchResults = [];
let searchIds = [];


function search() {
    searchResults = [];
    searchIds = [];
    let searchbar = document.getElementById('searchbar');
    let userInput = searchbar.value.toLowerCase();
    compareUserInput(userInput);
}


function compareUserInput(userInput) {
    for (let i = 0; i < pokemons.length; i++) comparePokemons(userInput, i);
    if (searchResults.length == 0) resetSearchbar();
    else renderFoundPokemons(canvas);
}


function comparePokemons(userInput, i) {
    if (pokemons[i].name.includes(userInput)) {
        searchResults.push(pokemons[i]);
        searchIds.push(i);
    }
}


function resetSearchbar() {
    let canvas = document.getElementById('canvas');
    let searchbar = document.getElementById('searchbar');
    canvas.innerHTML = '';
    canvas.innerHTML = `<span style='color:white';>No Pokemon found for '${searchbar.value}'!</span>`;
    searchbar.value = '';
    renderAllTimeout();
}


function renderFoundPokemons() {
    canvas.innerHTML = '';
    for (let i = 0; i < searchResults.length; i++) {
        canvas.innerHTML += templateHTML(searchResults[i], searchIds[i]);
    }
}


function renderAllTimeout() {
    let canvas = document.getElementById('canvas');
    setTimeout(function () {
        canvas.innerHTML = '';
        for (let i = 0; i < pokemons.length; i++) {
            renderPokemon(pokemons[i], ids[i]);
        }
    }, 2000);
}


function renderAllNoTimeout() {
    canvas.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) renderPokemon(pokemons[i], ids[i]);
}


function clearSearch() {
    let searchbar = document.getElementById('searchbar');
    searchbar.value = '';
    renderAllNoTimeout();
}