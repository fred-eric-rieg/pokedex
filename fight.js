let currentPlayerHealth = 0;
let currentEnemyHealth = 0;

let chosenAttackName = '';
let chosenAttackDmg = 0;
let chosenAttacHitChance = 0;

let chosenEnemyAttackName = '';
let chosenEnemyAttackDmg = 0;

let playersTurn = true;

/**
 * Called when player selects a move.
 */
function lockMove(moveId, index) {
    if (playersTurn) {
        playSound(click);
        chosenAttackName = returnValidMoveName(index);
        hightlightMove(moveId);
        writeAttackDescription('move', idPlayer);
        activateAttackBtn();
        chosenAttackDmg = playerMoves[index].power;
        chosenAttacHitChance = playerMoves[index].accuracy;
    }
}

/**
 * Highlights the move that is selected by the player.
 * @param {*} moveId 
 */
function hightlightMove(moveId) {
    for (let i = 0; i < 3; i++) {
        let removeHighlight = document.getElementById("move" + i);
        removeHighlight.setAttribute('style', 'border: none;')
    }
    let highlightedMove = document.getElementById(moveId);
    highlightedMove.setAttribute('style', 'border: 2px solid black');
}

/**
 * Called when player clicks the attack-button. Starts the attack animation & calculation process.
 */
function startAttack() {
    if (playersTurn) {
        playersTurn = false;
        deactivateAttackBtn();
        playSound(attack);
        playSound(click);
        currentEnemyHealth -= calculateDamageToEnemy();
        writeAttackDescription('', idPlayer);
        visualiseAttackEffect(idPlayer);
        setTimeout(function () {
            checkIfDead(idEnemy);
        }, 1000);
    } else {
        playSound(cancel);
    }
}

/**
 * Damage is calculated by the following formula:
 * attack = (attack * attackStat / 100) - (defense * 0.5)
 * If the damage is below 1, it is set to 1.
 */
function calculateDamageToEnemy() {
    let damage = Math.floor(chosenAttackDmg
        * pokemons[idPlayer].stats[1].base_stat / 100
        - pokemons[idEnemy].stats[2].base_stat * 0.5);

    return damage > 0 ? damage : damage = 1;
}

/**
 * Activates the attack button and sets the onclick attribute to startAttack().
 * Is called when a move is selected.
 */
function activateAttackBtn() {
    let attackbtn = document.getElementById('attackbtn');
    attackbtn.classList.remove('attackbtn-inactive');
    attackbtn.setAttribute('onclick', 'startAttack()');
}


function deactivateAttackBtn() {
    let attackbtn = document.getElementById('attackbtn');
    attackbtn.classList.add('attackbtn-inactive');
    attackbtn.removeAttribute('onclick', 'startAttack()');
}

/**
 * 
 * @param {*} id
 */
function checkIfDead(id) {
    if (id == idEnemy) {
        if (currentEnemyHealth < 1) {
            playSound(dead);
            updateHealthpoints(idEnemy, "dead");
            visualiseDeath(idEnemy);
            displayWinner();
            setTimeout(function () {
                closeArena();
                hideWinner();
            }, 2000);
        } else {
            updateHealthpoints(idEnemy, "alive");
            visualiseHitEffect(opponent);
            setTimeout(function () {
                playersTurn = false;
                startEnemyAttack();
            }, 2000);
        }
    } else {
        if (currentPlayerHealth < 1) {
            playSound(dead);
            updateHealthpoints(idPlayer, "dead");
            visualiseDeath(idPlayer);
            setTimeout(function () {
                closeArena();
            }, 2000);
        } else {
            updateHealthpoints(idPlayer, "alive");
            visualiseHitEffect(champion);
            setTimeout(function () {
                writeAttackDescription("Choose your attack!", idPlayer);
            }, 2000);
        }
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} status 
 */
function updateHealthpoints(id, status) {
    let enemyHealth = document.getElementById('innerEnemy');
    let playerHealth = document.getElementById('innerPlayer');
    if (id == idEnemy & status == "dead") {
        enemyHealth.setAttribute('style', `width:0px;`);
        enemyHealth.innerHTML = `0/${pokemons[idEnemy].stats[0].base_stat}`;
    }
    if (id == idEnemy & status == "alive") {
        enemyHealth.setAttribute('style', `width:${Math.floor(currentEnemyHealth * 100 / pokemons[idEnemy].stats[0].base_stat)}px;`);
        enemyHealth.innerHTML = `${currentEnemyHealth}/${pokemons[idEnemy].stats[0].base_stat}`;
    }
    if (id == idPlayer & status == "dead") {
        playerHealth.setAttribute('style', `width:0px;`);
        playerHealth.innerHTML = `0/${pokemons[idPlayer].stats[0].base_stat}`;
    }
    if (id == idPlayer & status == "alive") {
        playerHealth.setAttribute('style', `width:${Math.floor(currentPlayerHealth * 100 / pokemons[idPlayer].stats[0].base_stat)}px;`);
        playerHealth.innerHTML = `${currentPlayerHealth}/${pokemons[idPlayer].stats[0].base_stat}`;
    }
}

/**
 * 
 * @param {*} id 
 */
function visualiseDeath(id) {
    if (id == idEnemy) {
        let opponent = document.getElementById('opponent');
        opponent.classList.add('turn-img-round');
        setTimeout(function () {
            opponent.classList.add('drop-img-down');
        }, 225);
    } else {
        let champion = document.getElementById('champion');
        champion.classList.add('turn-img-round');
        setTimeout(function () {
            champion.classList.add('drop-img-down');
        }, 225);
    }
}

/**
 * 
 * @param {*} id 
 */
function visualiseAttackEffect(id) {
    let opponent = document.getElementById('opponent');
    let champion = document.getElementById('champion');
    if (id == idPlayer) {
        for (let i = 1; i < 4; i++) {
            setTimeout(function () {
                champion.classList.remove('move-img-left');
                champion.classList.add('move-img-right');
            }, i * 100)
            setTimeout(function () {
                champion.classList.remove('move-img-right');
                champion.classList.add('move-img-left');
            }, i * 200);
        };
    } else {
        for (let i = 1; i < 4; i++) {
            setTimeout(function () {
                opponent.classList.remove('move-img-right');
                opponent.classList.add('move-img-left');
            }, i * 100)
            setTimeout(function () {
                opponent.classList.remove('move-img-left');
                opponent.classList.add('move-img-right');
            }, i * 200);
        };
    }
}


function visualiseHitEffect(pokemon) {
    pokemon.classList.add('hit');
    for (let i = 1; i < 6; i++) {
        if (i == 1 || i == 3 || i == 5) {
            setTimeout(function () {
                pokemon.classList.remove('hit');
            }, i * 100);
        } else {
            setTimeout(function () {
                pokemon.classList.add('hit');
            }, i * 100);
        }
    }
}

/**
 * Starts the enemie's attack process.
 */
function startEnemyAttack() {
    playSound(attack);
    visualiseAttackEffect(idEnemy);
    chooseEnemyAttack();
    setTimeout(function () {
        visualiseHitEffect(champion);
        writeAttackDescription("move", idEnemy);
        currentPlayerHealth -= claculateDamageToPlayer();
        setTimeout(function () {
            writeAttackDescription("", idEnemy);
        }, 1000);
        checkIfDead(idPlayer);
    }, 1000);
}

/**
 * Chooses a random attack from the enemy's move array (1-3).
 * Sets dmg and name variables accordingly.
 */
function chooseEnemyAttack() {
    randomIndex = Math.floor(Math.random() * 3);
    chosenEnemyAttackName = enemyMoves[randomIndex].name;
    chosenEnemyAttackDmg = enemyMoves[randomIndex].power;
}

/**
 * Calculates the damage to the player's health with formular:
 * attack = (attack * attackStat / 100) * (defense / 100)
 * @returns number.
 */
function claculateDamageToPlayer() {
    let damage = Math.floor(chosenEnemyAttackDmg
        * pokemons[idEnemy].stats[1].base_stat / 100
        - pokemons[idPlayer].stats[2].base_stat * 0.5);

    return damage > 0 ? damage : damage = 1;
}

/**
 * Handles the attack description box output.
 * @param {*} type as string.
 * @param {*} id as number.
 */
function writeAttackDescription(type, id) {
    id == idPlayer ? handlePlayerAttackDescription(type) : handleEnemyAttackDescription(type);
}


function handlePlayerAttackDescription(type) {
    if (type == "move") {
        showAttackName('player');
    } else if (type == "Choose your attack!") {
        resetAttack();
    } else {
        showAttackDamage('player');
    }
}


function handleEnemyAttackDescription(type) {
    type == "move" ? showAttackName('enemy') : showAttackDamage('enemy');
}


function showAttackName(from) {
    let attackDescription = document.getElementById('attackDescription');
    from == 'player' ?
        attackDescription.innerHTML = chosenAttackName
        : attackDescription.innerHTML = `${pokemons[idEnemy].name} chooses ${chosenEnemyAttackName}`;
}


function resetAttack() {
    let attackDescription = document.getElementById('attackDescription');
    attackDescription.innerHTML = "Choose your attack!";
    chosenAttackName = '';
    chosenAttackDmg = 0;
    chosenAttacHitChance = 0;
    setTimeout(function () {
        playersTurn = true;
    }, 1000);
    
}


function showAttackDamage(from) {
    let attackDescription = document.getElementById('attackDescription');
    from == 'player' ?
        attackDescription.innerHTML = `${pokemons[idPlayer].name} inflicted ${calculateDamageToEnemy()} dmg`
        : attackDescription.innerHTML = `
        ${pokemons[idEnemy].name} inflicted ${claculateDamageToPlayer()} dmg
        `;
}


function displayWinner() {
    let arena = document.getElementById('arena');
    arena.classList.add('winner');
}


function hideWinner() {
    let arena = document.getElementById('arena');
    arena.classList.remove('winner');
}