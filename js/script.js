// Current Pokemon that is fetched from server is stored here (one after another).
let currentPokemon;

// Collects all pokemon that were fetched.
let allPokemons = [];

// Activates keypress navigation when user clicks on a small pokemon card.
let keyPressNavigation = false;
let keyPressPokemonId;

// Eventlistener for keypress navigation.
window.addEventListener('keydown', function (e) {
    if (e.key == 'ArrowRight' && keyPressNavigation) {
        nextPokemon(keyPressPokemonId);
    } else if (e.key == 'ArrowLeft' && keyPressNavigation) {
        previousPokemon(keyPressPokemonId);
    }
});


/**
 * Onclick function of loadbtn in index.html that loads the remaining pokemon if user clickes on it.
 */
function loadMore() {
    if (allPokemons.length == 20) {
        let loadbtn = document.getElementById('loadbtn');
        loadbtn.innerHTML = "loading completed";
        loadbtn.style.background = 'purple';
        loadbtn.style.cursor = 'default';
        allPokemons = [];
        playSound(click);
        getPokemons(151);
    }
}

/**
 * Async fetching of pokemon from server in parallel. Initial load is 20 pokemon.
 * @param {*} amountOfPokemons as integer.
 */
async function getPokemons(amountOfPokemons) {
    hideCanvas();
    showLoadingScreen();
    const promises = Array.from({ length: amountOfPokemons }, (_, i) => fetchPokemon(i + 1));
    const pokemons = await Promise.all(promises);
    renderPokemon(pokemons.filter(p => p !== null).sort((a, b) => a.id - b.id));
    hideLoadingScreen();
    showCanvas();
}


async function fetchPokemon(i) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.log(error);
    }
    
}


function showLoadingScreen() {
    let loading = document.getElementById('loading');
    loading.classList.remove('d-none');
}


function hideLoadingScreen() {
    let loading = document.getElementById('loading');
    loading.classList.add('d-none');
}


function hideCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    canvas.classList.add('d-none');
}


function showCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.classList.remove('d-none');
}


function renderPokemon(pokemons) {
    let canvas = document.getElementById('canvas');
    pokemons.length == 20 ? canvas.innerHTML = '' : null;
    pokemons.forEach(pokemon => {
        allPokemons.push(pokemon);
        canvas.innerHTML += templateHTML(pokemon);
        changeTypeColor(pokemon, pokemon.id);
    });
}


function templateHTML(currentPokemon) {
    return `
        <div class="wrap">
            <div class="card" id="card${currentPokemon.id}" onclick="showPokemon(${currentPokemon.id - 1})" onmouseover="changeColor('${currentPokemon.types[0].type.name}', ${currentPokemon.id})">
                <span>#${currentPokemon.id}<br><b>${currentPokemon.name.toUpperCase()}</b></span>
                <img style="height:150px;object-fit:contain;" src="${currentPokemon.sprites.front_default}">
                <div class="type" id="types${currentPokemon.id}">${currentPokemon.types[0].type.name.toUpperCase()}</div>
            </div>
        </div>
    `;
}

/**
 * Changes the color of a Pokemon's type on the small card depending on the typeName
 * @param {*} currentPokemon 
 * @param {*} id 
 */
function changeTypeColor(currentPokemon, id) {
    let type = currentPokemon.types[0].type.name;
    let typeId = document.getElementById(`types${id}`);
    if (type == "grass" | type == "poison") typeId.style.background = 'lightgreen';
    else if (type == "fire" | type == "dragon") typeId.style.background = 'lightcoral';
    else if (type == "water" | type == "ice") typeId.style.background = 'lightskyblue';
    else if (type == "normal" | type == "rock") typeId.style.background = '#ccc';
    else if (type == "bug" | type == "ground") typeId.style.background = 'burlywood';
    else if (type == "electric") typeId.style.background = 'yellow';
    else if (type == "fairy") typeId.style.background = 'pink';
    else if (type == "psychic" | type == "ghost" | type == "fighting") typeId.style.background = 'violet';
}

/**
 * User hovers over a card, then card changes color to corresponding pokemon-type.
 * @param {*} type 
 * @param {*} id 
 */
function changeColor(type, id) {
    let card = document.getElementById(`card${id}`);
    if (type == "grass" | type == "poison") card.classList.add('green-card');
    else if (type == "fire" | type == "dragon") card.classList.add('red-card');
    else if (type == "water" | type == "ice") card.classList.add('blue-card');
    else if (type == "normal" | type == "rock") card.classList.add('grey-card');
    else if (type == "bug" | type == "ground") card.classList.add('brown-card');
    else if (type == "electric") card.classList.add('yellow-card');
    else if (type == "fairy") card.classList.add('pink-card');
    else if (type == "psychic" | type == "ghost" | type == "fighting") card.classList.add('violet-card');
}

/**
 * Rendering process of a single large pokemon card when user clicks on a corresponding small pokemon card.
 * @param {*} id as integer.
 */
function showPokemon(id) {
    playSound(click);
    playSound(soundtrack);
    keyPressNavigation = true;
    keyPressPokemonId = id;
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.innerHTML = '';
    miniCanvas.innerHTML = renderSinglePokemon(allPokemons[id]);
}

/**
 * This is a html template auxiliary function called by the showPokemon(id) function.
 * @param {*} id as integer.
 * @returns html template of a single large pokemon card.
 */
function renderSinglePokemon(pokemon) {
    return `
        <div class="wrap-nohover">
            <div class="card-nohover" id="card${pokemon.id}">
                <div style="display:flex;justify-content:space-between;">
                    <span>#${pokemon.id}<br><b>${pokemon.name.toUpperCase()}</b></span>
                    <button class="btn" id="closebtn" onclick="hideOverlay(event)" style="align-self:end;width:50px;height:40px;margin-top:0;">X</button>
                </div>
                <div class="arrow-img-arrow">
                    <div class="arrow" onclick="previousPokemon(${pokemon.id})"><</div>
                    <img id="img${pokemon.id}" style="height:150px;object-fit:contain;" src="${pokemon.sprites.front_default}">
                    <div clasS="arrow" onclick="nextPokemon(${pokemon.id})">></div>
                </div>
                <div class="stats">health <div class="outer"><div class="inner" style="width:${pokemon.stats[0].base_stat}px;">${pokemon.stats[0].base_stat}</div></div></div>
                <div class="stats">attack <div class="outer"><div class="inner" style="width:${pokemon.stats[1].base_stat}px;">${pokemon.stats[1].base_stat}</div></div></div>
                <div class="stats">defense <div class="outer"><div class="inner" style="width:${pokemon.stats[2].base_stat}px;">${pokemon.stats[2].base_stat}</div></div></div>
                <div class="stats">speed <div class="outer"><div class="inner" style="width:${pokemon.stats[5].base_stat}px;">${pokemon.stats[5].base_stat}</div></div></div>
                <button id="startFight" class="btn" onclick="startFight(event, ${pokemon.id})">select Champion</button>
            </div>
        </div>
    `;
}

/**
 * This function is called when unser clicks on "select Champion" on the large pokemon card.
 * The fight sequence starts here -> playing sounds, starting effects, opening the arena and
 * preventing user to close the arena during this several second long process.
 * @param {*} event as propagation.
 * @param {*} id as integer.
 */
function startFight(event, id) {
    event.stopPropagation();
    preventUserClosingArenaDuringOpening();
    playSound(click);
    playSound(fight);
    rotatePokemon(id);
    pauseSoundAndOpenArena(id);
}

/**
 * Auxiliary function for startFight that removes the onclick
 * functionalities of the overlay and the close button.
 */
function preventUserClosingArenaDuringOpening() {
    let overlay = document.getElementById('overlay');
    overlay.setAttribute('onclick', '');
    let closebtn = document.getElementById('closebtn')
    closebtn.setAttribute('onclick', '');
    closebtn.style.cursor = 'default';
    let startFight = document.getElementById('startFight');
    startFight.setAttribute('onclick', '');
    startFight.style.cursor = 'default';
}

/**
 * Auxiliary function for startFight that pauses the soundtrack and opens the arena overlay.
 */
function pauseSoundAndOpenArena(id) {
    setTimeout(function () {
        pauseSound(soundtrack);
    }, 1000);
    setTimeout(function () {
        openArena(id); // Moving to arena.js
    }, 3000);
}

/**
 * Lets the selected Pokemon rotate as defined in style.css (.rotate).
 * @param {*} id as integer.
 */
function rotatePokemon(id) {
    let image = document.getElementById(`img${id}`);
    image.classList.add('rotate');
}

/**
 * Hiding the overlay with a delay by shrinking it.
 * @param {*} event as propagation.
 */
function hideOverlayDelayed(event) {
    if (event) event.stopPropagation();
    let overlay = document.getElementById('overlay');
    let arena = document.getElementById('arena');
    overlayTimeout(overlay, arena);
    arena.classList.remove('big');
    arena.classList.add('small');
    arena.innerHTML = '';
    pauseSound(fight);
    overlay.setAttribute('onclick', 'hideOverlay(event);');
}

/**
 * 
 * @param {*} overlay 
 * @param {*} arena as arena object.
 */
function overlayTimeout(overlay, arena) {
    let miniCanvas = document.getElementById('miniCanvas');
    setTimeout(function () {
        overlay.classList.add('d-none');
        arena.classList.remove('d-flex');
        arena.classList.add('d-none');
        miniCanvas.classList.remove('d-none');
        playSound(cancel);
    }, 1000);
}

/**
 * 
 * @param {*} event 
 */
function hideOverlay(event) {
    event.stopPropagation();
    keyPressNavigation = false;
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    overlay.classList.add('d-none');
    miniCanvas.classList.remove('d-none');
    let closebtn = document.getElementById('closebtn');
    closebtn.setAttribute('onclick', 'closeArena(event)');
    closebtn.style.cursor = 'pointer';
    cancel.currentTime = 0;
    cancel.play();
}

/**
 * Implemented in index.html and called by user onclick on 1) mini-canvas and 2) arena (both within overlay)
 * @param {*} event as propagation.
 */
function maintainOverlay(event) {
    event.stopPropagation();
}


/**
 * Selects the previous Pokemon if it exists, otherwise jumps to the last Pokemon in the allPokemon-List.
 * @param {*} id as number. 
 */
function previousPokemon(id) {
    allPokemons[id - 1] ? showPokemon(id - 1) : showPokemon(allPokemons.length - 1);
}

/**
 * Selects the next Pokemon if it exists, otherwise jumps to the first Pokemon in the allPokemon-List.
 * @param {*} id as number. 
 */
function nextPokemon(id) {
    allPokemons[id + 1] ? showPokemon(id + 1) : showPokemon(0);
} 