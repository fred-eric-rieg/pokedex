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
        * allPokemons[idPlayer].stats[1].base_stat / 100
        - allPokemons[idEnemy].stats[2].base_stat * 0.5);

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
 * Checking status of the enemy and the player after the attack. Starts a specific animation depending on the outcome.
 * @param {*} id
 */
function checkIfDead(id) {
    if (id == idEnemy) {
        if (currentEnemyHealth < 1) {
            enemyIsDead();
        } else {
            enemyStillAlive();
        }
    } else if (id == idPlayer) {
        if (currentPlayerHealth < 1) {
            playerIsDead();
        } else {
            playerStillAlive();
        }
    }
}


function enemyIsDead() {
    playSound(dead);
    updateHealthpoints(idEnemy, "dead");
    visualiseDeath(idEnemy);
    displayWinner();
    setTimeout(function () {
        closeArena();
        hideWinner();
    }, 2000);
}


function enemyStillAlive() {
    updateHealthpoints(idEnemy, "alive");
    visualiseHitEffect(opponent);
    setTimeout(function () {
        playersTurn = false;
        startEnemyAttack();
    }, 2000);
}


function playerIsDead() {
    playSound(dead);
    updateHealthpoints(idPlayer, "dead");
    visualiseDeath(idPlayer);
    setTimeout(function () {
        closeArena();
    }, 2000);
}


function playerStillAlive() {
    updateHealthpoints(idPlayer, "alive");
    visualiseHitEffect(champion);
    setTimeout(function () {
        writeAttackDescription("Choose your attack!", idPlayer);
    }, 2000);
}

/**
 * Updating healthbars and healthpoints.
 * @param {*} id as string.
 * @param {*} status as string.
 */
function updateHealthpoints(id, status) {
    checkOnEnemyHealth(id, status);
    checkOnPlayerHealth(id, status);
}


function checkOnEnemyHealth(id, status) {
    let enemyHealth = document.getElementById('innerEnemy');
    if (id == idEnemy & status == "dead") {
        enemyHealth.setAttribute('style', `width:0px;`);
        enemyHealth.innerHTML = `0/${allPokemons[idEnemy].stats[0].base_stat}`;
    }
    if (id == idEnemy & status == "alive") {
        enemyHealth.setAttribute('style', `width:${Math.floor(currentEnemyHealth * 100 / allPokemons[idEnemy].stats[0].base_stat)}px;`);
        enemyHealth.innerHTML = `${currentEnemyHealth}/${allPokemons[idEnemy].stats[0].base_stat}`;
    }
}


function checkOnPlayerHealth(id, status) {
    let playerHealth = document.getElementById('innerPlayer');
    if (id == idPlayer & status == "dead") {
        playerHealth.setAttribute('style', `width:0px;`);
        playerHealth.innerHTML = `0/${allPokemons[idPlayer].stats[0].base_stat}`;
    }
    if (id == idPlayer & status == "alive") {
        playerHealth.setAttribute('style', `width:${Math.floor(currentPlayerHealth * 100 / allPokemons[idPlayer].stats[0].base_stat)}px;`);
        playerHealth.innerHTML = `${currentPlayerHealth}/${allPokemons[idPlayer].stats[0].base_stat}`;
    }
}

/**
 * Adds a css class to either the enemy or the player to visualise the hit effect.
 * @param {*} id as string.
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
 * @param {*} id as string.
 */
function visualiseAttackEffect(id) {
    if (id == idPlayer) {
        putEffectOnPlayer();
    } else {
        putEffectOnEnemy();
    }
}

/**
 * Adds a css class to the player to visualize a attack effect.
 */
function putEffectOnPlayer() {
    let champion = document.getElementById('champion');
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
}

/**
 * Adds a css class to the enemy to visualize a attack effect.
 */
function putEffectOnEnemy() {
    let opponent = document.getElementById('opponent');
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

/**
 * Adds and removes a css class to visualize a hit effect.
 * @param {*} pokemon as html object.
 */
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
    }, 500);
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
        * allPokemons[idEnemy].stats[1].base_stat / 100
        - allPokemons[idPlayer].stats[2].base_stat * 0.5);

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
        : attackDescription.innerHTML = `${allPokemons[idEnemy].name} chooses ${chosenEnemyAttackName}`;
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
        attackDescription.innerHTML = `You inflicted ${calculateDamageToEnemy()} dmg`
        : attackDescription.innerHTML = `
        It inflicted ${claculateDamageToPlayer()} dmg
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