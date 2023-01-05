let searchResults = [];
let searchIds = [];

/**
 * Overall search function that is called by typing into searchbar "onkeyup"
 */
function search() {
    searchResults = [];
    searchIds = [];
    let searchbar = document.getElementById('searchbar');
    let userInput = searchbar.value.toLowerCase();
    compareUserInput(userInput);
}

/**
 * Compares user-input to pokemons array. resets searchbar if no match, else calls render function
 * @param {*} userInput as string
 */
function compareUserInput(userInput) {
    for (let i = 0; i < pokemons.length; i++) comparePokemons(userInput, i);
    if (searchResults.length == 0) resetSearchbar();
    else renderFoundPokemons(canvas);
}

/**
 * Help function that actually compares by include-search of user-input
 * @param {*} userInput as string
 * @param {*} i as integer
 */
function comparePokemons(userInput, i) {
    if (pokemons[i].name.includes(userInput)) {
        searchResults.push(pokemons[i]);
        searchIds.push(i);
    }
}

/**
 * Resets searchbar and gives user feedback on his search. Calls a timeout render function.
 */
function resetSearchbar() {
    let canvas = document.getElementById('canvas');
    let searchbar = document.getElementById('searchbar');
    canvas.innerHTML = '';
    canvas.innerHTML = `<span style='color:white';>No Pokemon found for '${searchbar.value}'!</span>`;
    searchbar.value = '';
    renderAllTimeout();
}

/**
 * Immedeately renders all found pokemons from searchResults
 */
function renderFoundPokemons() {
    canvas.innerHTML = '';
    for (let i = 0; i < searchResults.length; i++) {
        canvas.innerHTML += templateHTML(searchResults[i], searchIds[i]);
    }
}

/**
 * A special render function with a timeout that is called by resetSearchbar()
 */
function renderAllTimeout() {
    let canvas = document.getElementById('canvas');
    setTimeout(function () {
        canvas.innerHTML = '';
        for (let i = 0; i < pokemons.length; i++) {
            renderPokemon(pokemons[i], ids[i]);
        }
    }, 2000);
}

/**
 * Renders without a timeout that is only called by clearSearch()
 */
function renderAllNoTimeout() {
    canvas.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) renderPokemon(pokemons[i], ids[i]);
}

/**
 * Clears the searchbar and immediately renders (without timeout)
 */
function clearSearch() {
    let searchbar = document.getElementById('searchbar');
    searchbar.value = '';
    renderAllNoTimeout();
}