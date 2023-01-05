// Current Pokemon that is fetched from server is stored here (one after another).
let currentPokemon;

// Collects all pokemon that were fetched.
let pokemons = [];

// Collects ids off all pokemon that were fetched.
let ids = [];

// Initially creates 20 ids equally to the first 20 pokemons from pokeAPI that will be loaded with getData().
createIds(1, 20);

/**
 * This function creates ids (integers) and pushes these to the ids-array.
 * @param {*} start as integer (minimum 1).
 * @param {*} end as integer (maximum is the last pokemon from pokedex API).
 */
function createIds(start, end) {
    for (i = start; i < end+2; i++) {
        ids.push(i);
    }
}

/**
 * Onclick function of loadbtn in index.html that loads the remaining pokemon if user clickes on it.
 */
function loadMore() {
    if (ids.length < 22) {
        let loadbtn = document.getElementById('loadbtn');
        loadbtn.innerHTML = "loading completed";
        pokemons = [];
        ids = [];
        playSound(click);
        createIds(1, 150);
        getData();
    } else {
        playSound(cancel);
    }
}

/**
 * This function loads Pokemons from PokeAPI one after another according to the length of ids-array.
 */
async function getData() {
    hideCanvas();
    showLoadingScreen();
    for (let i = 0; i < ids.length; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${ids[i]}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokemons.push(currentPokemon);
        renderPokemon(currentPokemon, ids[i]);
    }
    hideLoadingScreen();
    showCanvas();
}

/**
 * 
 */
function showLoadingScreen() {
    let loading = document.getElementById('loading');
    loading.classList.remove('d-none');
}

/**
 * 
 */
function hideLoadingScreen() {
    let loading = document.getElementById('loading');
    loading.classList.add('d-none');
}

/**
 * 
 */
function hideCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    canvas.classList.add('d-none');
}

/**
 * 
 */
function showCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.classList.remove('d-none');
}

/**
 * 
 * @param {*} currentPokemon 
 * @param {*} id 
 */
function renderPokemon(currentPokemon, id) {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML += templateHTML(currentPokemon, id);
    changeTypeColor(currentPokemon, id);
}

/**
 * 
 * @param {*} currentPokemon 
 * @param {*} id 
 * @returns html template that creates one pokemon card.
 */
function templateHTML(currentPokemon, id) {
    return `
        <div class="wrap">
            <div class="card" id="card${id}" onclick="showPokemon(${id})" onmouseover="changeColor('${currentPokemon.types[0].type.name}', ${id})">
                <span>#${id}<br><b>${currentPokemon.name.toUpperCase()}</b></span>
                <img style="height:150px;object-fit:contain;" src="${currentPokemon.sprites.front_default}">
                <div class="type" id="types${id}">${currentPokemon.types[0].type.name.toUpperCase()}</div>
            </div>
        </div>
    `;
}

/**
 * 
 * @param {*} currentPokemon 
 * @param {*} index of the moves array from Pokedex API.
 * @returns either the name of the current Pokemon's move at a given index or nothing.
 */
function checkAbility(currentPokemon, index) {
    if (currentPokemon.moves[index]) {
        return `${currentPokemon.moves[index].move.name}`;
    } else {
        return '';
    }
}

/**
 * Changes the color of a Pokemon's type on the card depending on the typeName
 * @param {*} currentPokemon 
 * @param {*} id 
 */
function changeTypeColor(currentPokemon, id) {
        let typeName = currentPokemon.types[0].type.name;
        let type = document.getElementById(`types${id}`);
        if      (typeName == "grass")   type.style.background = 'lightgreen';
        else if (typeName == "fire")    type.style.background = 'lightcoral';
        else if (typeName == "water")   type.style.background = 'lightskyblue';
        else if (typeName == "wind")    type.style.background = 'lightskyblue';
        else if (typeName == "normal")  type.style.background = '#ccc';
        else if (typeName == "bug")     type.style.background = 'burlywood';
}

/**
 * Mousehover color effect of cards:
 * Changes the classList of a card depending on the Pokemon's type.
 * These classes create a colored background on mousehovering over the cards.
 * @param {*} type 
 * @param {*} id 
 */
function changeColor(type, id) {
    let card = document.getElementById(`card${id}`);
    if      (type == "grass")   card.classList.add('green-card');
    else if (type == "fire")    card.classList.add('red-card');
    else if (type == "water")   card.classList.add('blue-card');
    else if (type == "wind")    card.classList.add('blue-card');
    else if (type == "normal")  card.classList.add('grey-card');
    else if (type == "bug")     card.classList.add('brown-card');
}

/**
 * Rendering process of a single large pokemon card when user clicks on a corresponding small pokemon card.
 * @param {*} id as integer.
 */
function showPokemon(id) {
    playSound(click);
    playSound(soundtrack);
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.innerHTML = '';
    miniCanvas.innerHTML = renderSinglePokemon(id);;
}

/**
 * This is a html template auxiliary function called by the showPokemon(id) function.
 * @param {*} id as integer.
 * @returns html template of a single large pokemon card.
 */
function renderSinglePokemon(id) {
    return `
        <div class="wrap-nohover">
            <div class="card-nohover" id="card${id}">
                <div style="display:flex;justify-content:space-between;">
                    <span>#${id}<br><b>${pokemons[id-1].name.toUpperCase()}</b></span>
                    <button class="btn" id="closebtn" onclick="hideOverlay(event)" style="align-self:end;width:50px;height:40px;margin-top:0;">X</button>
                </div>
                <img id="img${id}" style="height:150px;object-fit:contain;" src="${pokemons[id-1].sprites.front_default}">
                <div class="stats">health <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[0].base_stat}px;">${pokemons[id-1].stats[0].base_stat}/100</div></div></div>
                <div class="stats">attack <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[1].base_stat}px;">${pokemons[id-1].stats[1].base_stat}/100</div></div></div>
                <div class="stats">defense <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[2].base_stat}px;">${pokemons[id-1].stats[2].base_stat}/100</div></div></div>
                <div class="stats">speed <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[5].base_stat}px;">${pokemons[id-1].stats[5].base_stat}/100</div></div></div>
                <button class="btn" onclick="startFight(event, ${id})">select Champion</button>
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
}

/**
 * Auxiliary function for timeout functions in startFight.
 */
function pauseSoundAndOpenArena(id) {
    setTimeout(function() {
        pauseSound(soundtrack);
    }, 1000);
    setTimeout(function() {
        openArena(id);
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
    overlay.setAttribute('onclick', 'hideOverlay();');
}

/**
 * 
 * @param {*} overlay 
 * @param {*} arena as arena object.
 */
function overlayTimeout(overlay, arena) {
    let miniCanvas = document.getElementById('miniCanvas');
    setTimeout(function() {
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
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    overlay.classList.add('d-none');
    miniCanvas.classList.remove('d-none');
    let closebtn = document.getElementById('closebtn');
    closebtn.setAttribute('onclick', 'closeArena(event)');
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