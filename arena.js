let idEnemy;
let idPlayer;

/**
 * Generates a random id and sets idEnemy to this id => random enemy to fight player in arena
 */
function getRandomEnemy() {
    if (pokemons.length < 22) {
        let randomId = Math.floor(Math.random() * 21);
        idEnemy = randomId;
    } else if (pokemons.length > 21) {
        let randomId = Math.floor(Math.random() * 152);
        idEnemy = randomId;
    }
}

/**
 * 
 * @param {*} id 
 */
function openArena(id) {
    idPlayer = id - 1;
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.classList.add('d-none');
    let arena = document.getElementById('arena');
    arena.classList.add('d-flex');
    arena.classList.remove('d-none');
    setTimeout(function () {
        arena.classList.add('big');
        setTimeout(function () {
            playSound(spawn);
            placePokoemon(arena);
            let overlay = document.getElementById('overlay');
            overlay.setAttribute('onclick', 'hideOverlayDelayed(event);');
        }, 2000);
    }, 1000);
}

/**
 * 
 * @param {*} arena 
 */
function placePokoemon(arena) {
    getRandomEnemy();
    arena.innerHTML = '';
    playersTurn = true;
    setTimeout(function () {
        arena.innerHTML += spritesHTML();
    }, 600);
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
        <div style="position:relative;top:-120px;">
            <img id="champion" style="height:150px;object-fit:contain;" src="${pokemons[idPlayer].sprites.back_default}">
            <img id="opponent" style="height:150px;object-fit:contain;" src="${pokemons[idEnemy].sprites.front_default}">
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


function setPlayerHealth() {
    currentPlayerHealth = pokemons[idPlayer].stats[0].base_stat;
}


function setEnemyHealth() {
    currentEnemyHealth = pokemons[idEnemy].stats[0].base_stat;
}

/**
 * 
 * @param {*} arena 
 */
function renderArenaMenu(arena) {
    arena.innerHTML += `
        <button class="btn" style="position:relative;top:-100px;" onclick="closeArena(event)">close</button>
        <div style="display:flex;justify-content:space-between;gap:50px;">
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
                    <button class="movebtn no-br" id="move1" onclick="lockMove('move1', ${idPlayer})">${pokemons[idPlayer].moves[0].move.name}</button>
                    <button class="movebtn no-br" id="move2" onclick="lockMove('move2', ${idPlayer})">${checkArenaAbility(1)}</button>
                    <button class="movebtn no-topbr" id="move3" onclick="lockMove('move3', ${idPlayer})">${checkArenaAbility(2)}</button>
                </div>
            </div>
            <div class="arena-menu-right">
                
                <p id="attackDescription">Choose your attack!</p>
            </div>
        </div>
    `;
}

/**
 * 
 * @param {*} index 
 * @returns 
 */
function checkArenaAbility(index) {
    if (pokemons[idPlayer].moves[index]) {
        return `${pokemons[idPlayer].moves[index].move.name}`;
    } else {
        return '';
    }
}

/**
 * 
 * @param {*} index 
 * @returns 
 */
function checkArenaAbilityUrl(index) {
    if (pokemons[idPlayer].moves[index]) {
        return `${pokemons[idPlayer].moves[index].move.url}`;
    } else {
        return '';
    }
}


function activateAttackBtn() {
    let attackbtn = document.getElementById('attackbtn');
    attackbtn.classList.remove('attackbtn-inactive');
    attackbtn.setAttribute('onclick', 'startAttack()');
}

/**
 * 
 * @param {*} moveId 
 */
function hightlightMove(moveId) {
    for (let i = 1; i < 4; i++) {
        let removeHighlight = document.getElementById("move"+i);
        removeHighlight.setAttribute('style', 'border: none;')
    }
    let highlightedMove = document.getElementById(moveId);
    highlightedMove.setAttribute('style', 'border: 2px solid black');
}
