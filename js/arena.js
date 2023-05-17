let idEnemy;
let idPlayer;
let playerMoves = [];
let enemyMoves = [];

/**
 * Called in script.js after choosing a Pokemon to fight with.
 * @param {*} id 
 */
function openArena(id) {
    keyPressNavigation = false;
    idPlayer = id - 1;
    getRandomEnemy();
    hideMinicanvasAndShowArena();
    loadMovesFromAPI();
    loadArenaContentsWithDelay();
}

/**
 * Generates a random id and sets idEnemy to this id => random enemy to fight player in arena
 */
function getRandomEnemy() {
    if (pokemons.length < 22) {
        let randomId = Math.floor(Math.random() * 21);
        randomId == 0 ? randomId + 1 : randomId; // Prevents id 0.
        randomId == idPlayer ? randomId + 1 : randomId; // Prevents id of player.
        randomId > 20 ? randomId - 1 : randomId; // Prevents id 20.
        idEnemy = randomId;
    } else if (pokemons.length > 21) {
        let randomId = Math.floor(Math.random() * 152);
        randomId == 0 ? randomId + 1 : randomId; // Prevents id 0.
        randomId == idPlayer ? randomId + 1 : randomId; // Prevents id of player.
        randomId > 151 ? randomId - 1 : randomId; // Prevents id 152.
        idEnemy = randomId;
    }
}


function hideMinicanvasAndShowArena() {
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.classList.add('d-none');
    let arena = document.getElementById('arena');
    arena.classList.add('d-flex');
    arena.classList.remove('d-none');
}

/**
 * Loads all moves of the player and the enemy from the API.
 */
async function loadMovesFromAPI() {
    playerMoves = []; // Clear old moves.
    enemyMoves = []; // Clear old moves.
    let counterPlayer = countPlayerMoves();
    let counterEnemy = countEnemyMoves();
    for (let index = 0; index < counterPlayer; index++) {
        collectPlayerMoves(index);
    }
    for (let index = 0; index < counterEnemy; index++) {
        collectEnemyMoves(index);
    }
}

/**
 * @returns number of moves the player has.
 */
function countPlayerMoves() {
    let moves = pokemons[idPlayer].moves;
    let counter = 0;
    for (let index = 0; index < moves.length; index++) {
        if (moves[index].move.url != null) {
            counter++;
        }
    }
    return counter;
}

/**
 * @returns number of moves the enemy has.
 */
function countEnemyMoves() {
    let moves = pokemons[idEnemy].moves;
    let counter = 0;
    for (let index = 0; index < moves.length; index++) {
        if (moves[index].move.url != null) {
            counter++;
        }
    }
    return counter;
}

/**
 * Collects only moves that have a power value.
 * @param {*} index as number.
 */
async function collectPlayerMoves(index) {
    let urlPlayer = pokemons[idPlayer].moves[index].move.url;
    let responsePlayer = await fetch(urlPlayer);
    let movePlayer = await responsePlayer.json();
    if (movePlayer.power != null) {
        playerMoves.push(movePlayer);
    }
}

/**
 * Collects only moves that have a power value.
 * @param {*} index as number.
 */
async function collectEnemyMoves(index) {
    let urlEnemy = pokemons[idEnemy].moves[index].move.url;
    let responseEnemy = await fetch(urlEnemy);
    let moveEnemy = await responseEnemy.json();
    enemyMoves.push(moveEnemy);
}

/**
 * Widens the arena after 1 second.
 * After 3 seconds: allows player to use the close arena button and places the Pokemon into arena.
 */
function loadArenaContentsWithDelay() {
    setTimeout(function () {
        arena.classList.add('big');
    }, 1000);
    setTimeout(function () {
        playSound(spawn);
        placePokemon(arena);
        setPrefightValues();
        let overlay = document.getElementById('overlay');
        overlay.setAttribute('onclick', 'hideOverlayDelayed(event);');
    }, 3000);
}

/**
 * Place pokemon with delay to create a spawning effect.
 * @param {*} arena 
 */
function placePokemon(arena) {
    arena.innerHTML = '';
    setTimeout(function () {
        arena.innerHTML += spritesHTML();
    }, 600);
    
}

/**
 * Sets the player's and enemy's health to the base stat of their current pokemon.
 */
function setPrefightValues() {
    playersTurn = true; // If player fights again, this resets the turn.
    setPlayerHealth();
    setEnemyHealth();
    renderArenaMenu(arena);
}

/**
 * Returns two images depicting the pokemon of the player and the enemy 
 * @returns
 */
function spritesHTML() {
    return `
        <div style="position:relative;top:-120px;display:flex;">
            <img id="champion" style="height:160px;object-fit:contain;" src="${pokemons[idPlayer].sprites.back_default}">
            <img id="opponent" style="height:140px;object-fit:contain;" src="${pokemons[idEnemy].sprites.front_default}">
        </div>
    `;
}

/**
 * 
 * @param {*} event stopping propagation.
 */
function closeArena(event) {
    playSound(click);
    hideOverlayDelayed(event);
    playersTurn = true;
}

/**
 * Sets player health in fight.js to the base stat of the player's current pokemon.
 */
function setPlayerHealth() {
    currentPlayerHealth = pokemons[idPlayer].stats[0].base_stat;
}

/**
 * Sets enemy health in fight.js to the base stat of the enemy's current pokemon.
 */
function setEnemyHealth() {
    currentEnemyHealth = pokemons[idEnemy].stats[0].base_stat;
}

/**
 * Html template function.
 * @param {*} arena 
 */
function renderArenaMenu(arena) {
    arena.innerHTML += `
        <button class="btn" style="position:relative;top:-100px;" onclick="closeArena(event)">close</button>
        <div style="display:flex;justify-content:space-between;gap:50px;color:white;">
            <div>
                ${pokemons[idPlayer].name} hp
                <div class="stats"><div class="outer"><div class="inner" id="innerPlayer" style="width:${currentPlayerHealth * 100 / pokemons[idPlayer].stats[0].base_stat}px;">${currentPlayerHealth}/${pokemons[idPlayer].stats[0].base_stat}</div></div></div>
            </div>
            
            <div>
                ${pokemons[idEnemy].name} hp
                <div class="stats"><div class="outer"><div class="inner" id="innerEnemy" style="width:${currentEnemyHealth * 100 / pokemons[idEnemy].stats[0].base_stat}px;">${currentEnemyHealth}/${pokemons[idEnemy].stats[0].base_stat}</div></div></div>
            </div>
        </div>
        
        <div class="move-container">
            <div class="arena-menu-left">
                <div class="move-buttons">
                    <button class="attackbtn attackbtn-inactive no-bottombr" id="attackbtn">attack</button>
                    <button class="movebtn no-br" id="move0" onclick="lockMove('move${returnValidMoveIndex(0)}', ${returnValidMoveIndex(0)})">${returnValidMoveName(0)}</button>
                    <button class="movebtn no-br" id="move1" onclick="lockMove('move${returnValidMoveIndex(1)}', ${returnValidMoveIndex(1)})">${returnValidMoveName(1)}</button>
                    <button class="movebtn no-topbr" id="move2" onclick="lockMove('move${returnValidMoveIndex(2)}', ${returnValidMoveIndex(2)})">${returnValidMoveName(2)}</button>
                </div>
            </div>
            <div class="arena-menu-right">
                
                <p id="attackDescription">Choose your attack!</p>
            </div>
        </div>
    `;
}

/**
 * Checks if a pokemon has a move at a specific index (some only have 1 move for example).
 * @param {*} index as integer.
 * @returns an index as number.
 */
function returnValidMoveIndex(index) {
    return playerMoves[index] ? index : 0;
}

/**
 * Checks if a pokemon has a move at a specific index (some only have 1 move for example).
 * @param {*} index as integer.
 * @returns name of the move as string.
 */
function returnValidMoveName(index) {
    return playerMoves[index] ? playerMoves[index].name : playerMoves[0].name;
}
