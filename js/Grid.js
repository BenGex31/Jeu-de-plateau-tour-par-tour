/**
 * Position class used in the array playerposition (property of class grid)
 * @class
 * @constructor
 */
class Position {
    /**
     * 
     * @param {Number} x X Coordinate
     * @param {Number} y Y Coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Grid class
 * @constructor
 * 
 * @param {Array} obstacleArray - array listing the obstacles
 * @param {Array} playerPosition - array listing the x and y position of each player
 */

class Grid {
    /**
    * 
    * @param {Number} numberOfRow - property that will be used to define the number of lines on the grid in the game class
    * @param {Number} numberOfColumn - property that will be used to define the number of columns on the grid in the game class
    * @param {Number} numberOfOstacle - property that will be used to define the number of obstacles on the grid in the game class
    * @param {Array} players - property that will be used to define the array of players in the game class
    * @property {Array} grid - two-dimensional array used to create the grid
    * @property {Array} obstacleArray
    * @property {Array} playerPosition
     */
    constructor(numberOfRow, numberOfColumn, numberOfOstacle, players) {
        this.players = players;
        this.numberOfRow = numberOfRow;
        this.numberOfColumn = numberOfColumn;
        this.numberOfOstacle = numberOfOstacle;
        this.grid = [];
        this.obstacleArray = [];
        this.playerPosition = [];
    }

    /**
     * @method generateRandomBoxes
     * executes class methods : createRandomObstacle, createRandomWeapon, createRandomPlayer.
     * executed in the play method of the Game class.
     * @this createRandomObstacle - method that randomly places obstacles
     * @this createRandomWeapon - method that randomly places weapons
     * @this createRandomPlayer - method that randomly places players
     */
    generateRandomBoxes() {
        this.createRandomObstacle();
        this.createRandomWeapon();
        this.createRandomPlayer();
    }

    /**
     * @method initGrid
     * creates the game grid by setting the number of y columns and x rows using two nested "for" loops.
     * creates a new instance of the Box class with an undefined identifier and an empty box type within the two-dimensional grid array
     * executed in the play method of the Game class.
     * @this numberOfColumn
     * @this numberOfRow
     * @this grid
     */
    initGrid() {
        for (let x = 0; x < this.numberOfColumn; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.numberOfRow; y++) {
                this.grid[x][y] = new Box(undefined, types.EMPTY); // init the created box
            }
        }
    }

    /**
     * @method generateGrid
     * generates the game grid dynamically by creating the html elements ("tr" and "td" tags) within the html "table" tag which has the identifier "grid" using two nested "for" loops.
     * attributes the class and the identifiers to the html tags.
     * executed in the play method of the Game class.
     * @this numberOfOstacle
     * @this numberOfRow
     */
    generateGrid() {
        for (let x = 0; x < this.numberOfColumn; x++) {
            let row = document.createElement("tr");
            let table = document.getElementById("grid");
            table.appendChild(row);
            row.setAttribute('class','line');

            for (let y = 0; y < this.numberOfRow; y++) {
                let col = document.createElement("td");
                row.appendChild(col);
                col.setAttribute('id', "box-" + y + "-" + x);
            }
        }
    }

    /**
     * @method createRandomBox
     * Generic method which randomly creates the placement of boxes on the grid, will be used for random placement methods createRandomObstacle, createRandomWeapon, createRandomPlayer.
     * @param {Array} items - will use the obstacle, player and weapon arrays
     * @param {string} type - will use Types object in the class Box
     * @param {function emptinessCondition(randomGridIdX, randomGridIdY) {}} emptinessCondition - if the empty condition returns "true",
     * then a new instance of the Box class is created with the identifier of the array of obstacles, weapons and players,
     * and their respective Type within the two-dimensional grid array
     * @param {function removeBoxFunction(items[i].id, randomGridIdX, randomGridIdY) {}} removeBoxFunction - function to remove the identifiers from the tables of obstacles, weapons and players,
     * as well as the random numbers x and y in order to avoid having duplicates generated on the grid.
     */
    createRandomBox(items, type, emptinessCondition, removeBoxFunction) {
        for (let i = 0; i < items.length; i++) {
            let randomGridIdX = Math.floor(Math.random() * this.numberOfColumn);
            let randomGridIdY = Math.floor(Math.random() * this.numberOfRow);
            if (emptinessCondition(randomGridIdX, randomGridIdY)) {
                this.grid[randomGridIdX][randomGridIdY] = new Box(items[i].id, type);
                if (removeBoxFunction) {
                    removeBoxFunction(items[i].id, randomGridIdX, randomGridIdY);
                }
            } else {
                i--; // if the two conditions do not return "true", then the "for" loop decrements (starts again)
            }
        }
    }

    /**
     * @method createRandomObstacle
     * method that randomly places obstacles using the generic "createRandomBox" method
     * @this numberOfOstacle
     */
    createRandomObstacle() {
        for (let i = 0; i < this.numberOfOstacle; i++) {
            this.obstacleArray.push({
                className : types.OBSTACLE
            });
        }
        this.createRandomBox(this.obstacleArray, types.OBSTACLE, (randomGridIdX, randomGridIdY) => {
            let isEmpty = this.grid[randomGridIdX][randomGridIdY].type === types.EMPTY
                || this.grid[randomGridIdX][randomGridIdY].type === types.EMPTY_PLAYER_EXCLUDED;
            return isEmpty;
        });
    }

    /**
     * @method createRandomWeapon
     * method that randomly places weapons using the generic "createRandomBox" method
     */
    createRandomWeapon() {
        this.createRandomBox(weaponsToDisplay, types.WEAPON, (randomGridIdX, randomGridIdY) => {
            let isEmpty = this.grid[randomGridIdX][randomGridIdY].type === types.EMPTY
                || this.grid[randomGridIdX][randomGridIdY].type === types.EMPTY_PLAYER_EXCLUDED;
            return isEmpty;
        });
    }

    /**
     * @method createRandomPlayer
     * method that randomly places players using the generic "createRandomBox" method.
     */
    createRandomPlayer() {
        this.createRandomBox(this.players, types.PLAYER, (randomGridIdX, randomGridIdY) => {
                let isEmpty = this.grid[randomGridIdX][randomGridIdY].type === types.EMPTY;
                return isEmpty;
            },
            (id, randomGridIdX, randomGridIdY) => {
                this.playerPosition[id] = new Position(randomGridIdX, randomGridIdY); // the identifier of the "playerPosition" array is equal to the creation of the new instance of the "Position" class with the x and y coordinates generated randomly
                this.markPlayerExcludedBoxes(id, randomGridIdX, randomGridIdY); // executes the "markPlayerExcludedBoxes" class method, allowing to identify the excluded boxes for the opposing player.
            }
        );
    }

    /**
     * @method markPlayerExcludedBoxes
     * generic method allowing to identify the excluded boxes of the opposing player
     * @param {Number} id - identifier of each array (obstacles, weapons, players)
     * @param {Number} xBox - randomly generated number corresponding to x coordinates.
     * @param {Number} yBox - randomly generated number corresponding to y coordinates.
     */
    markPlayerExcludedBoxes(id, xBox, yBox) {
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                let x = xBox + i;
                let y = yBox + j;
                const isCurrentBoxExists = x in this.grid && y in this.grid[x]; // check that the value x is in the array this.grid and that y is in the array this.grid[x]
                if (isCurrentBoxExists) {
                    let currentBox = this.grid[x][y];
                    let isEmpty = currentBox.type === types.EMPTY;
                    if (isEmpty) {
                        this.grid[x][y] = new Box(id, types.EMPTY_PLAYER_EXCLUDED); // we assign to the values x and y of the array this.grid a new instance of the Box class the identifier of each player and the character string "empty player-excluded" as Type.
                    }
                }
            }
        }
    }

    /**
     * @method markBoxesAllowedForMoves
     * method for defining the boxes allowed to move for players.
     * executes 4 "for" loops to define the directions of movement, and the "markBoxAllowedForMove" method inside
     * The break instruction terminates the current loop and passes control of the program to the instruction following the terminated instruction.
     * 
     * @param {Number} player - player in action, method executed in the play method in game.js.
     */
    markBoxesAllowedForMoves(player) {
        const playerPosition = this.playerPosition[player.id]; // allow to replace the indexes of the playerPosition array by the identifiers of each player

        const MAX_DISTANCE = 3; // maximum number of boxes to move
        for (let move = 1; move <= MAX_DISTANCE; move++) {
            let x = playerPosition.x + move; // movement to the right
            let y = playerPosition.y;
            if (this.markBoxAllowedForMove(x, y)) {
                break;
            }
        }
        for (let move = 1; move <= MAX_DISTANCE; move++) {
            let x = playerPosition.x;
            let y = playerPosition.y + move; // movement to the bottom
            if (this.markBoxAllowedForMove(x, y)) {
                break;
            }
        }
        for (let move = -1; move >= -MAX_DISTANCE; move--) {
            let x = playerPosition.x + move; // movement to the left
            let y = playerPosition.y;
            if (this.markBoxAllowedForMove(x, y)) {
                break;
            }
        }
        for (let move = -1; move >= -MAX_DISTANCE; move--) {
            let x = playerPosition.x;
            let y = playerPosition.y + move; // movement to the top
            if (this.markBoxAllowedForMove(x, y)) {
                break;
            }
        }
    }

    /**
     * @method markBoxAllowedForMove
     * Generic method to define the boxes authorized for movement and check whether the boxes are different from the types of obstacles and players in the array this.grid.
     * @param {number} x 
     * @param {number} y 
     */
    markBoxAllowedForMove(x, y) {
        const isCurrentBoxExists = x in this.grid && y in this.grid[x]; // check that the value x is in the array this.grid and that y is in the array this.grid[x]
        if (isCurrentBoxExists) {
            let currentBox = this.grid[x][y];
            if (currentBox.type === types.OBSTACLE) {
                return true;
            }
            const isBoxAllowedForMove = currentBox.type !== types.OBSTACLE && currentBox.type !== types.PLAYER;
            if (isBoxAllowedForMove) {
                this.grid[x][y].isEligibleForMove = true; // we assign the value "true" to the property "isEligibleForMove" in the array this.grid
            }
        }
        return false;
    }

    /**
     * @method movePlayer
     * generic method to update this.grid table for player movement and weapon pickup.
     * this.players array updated according to owned weapons for each player.
     * method executed in the "display" method of the "Game" class.
     * the "clear" method is executed
     * the "display(player)" method is executed
     * @param {Number} player - player in action
     * @param {Number} x - position x
     * @param {Number} y - position y
     */
    movePlayer(player, x, y) {
        const playerPosition = this.playerPosition[player.id]; // allow to replace the indexes of the playerPosition array by the identifiers of each player.
        if (player.previousWeaponId) { // previousWeaponId -> player class property
            this.grid[player.previousPosition.x][player.previousPosition.y] = new Box(player.previousWeaponId, types.WEAPON); // we assign to the indexes of the two-dimensional array this.grid which have the previous positions x and y as values, a new instance of the Box class with the identifier of each player's previous weapon and the "weapon" string.
            player.previousWeaponId = undefined;
        } else {
            this.grid[playerPosition.x][playerPosition.y] = new Box(undefined, types.EMPTY); // we assign to the indexes of the two-dimensional array this.grid which have the positions x and y as values, a new instance of the Box class with indefined value and the "empty" string.
        }
        const currentWeapon = this.grid[x][y].id;

        if (this.grid[x][y].type === types.WEAPON) { // if the type object of the two-dimensional array this.grid is equal to the string "weapon".
            player.previousWeaponId = player.weapon.id; // when the current player is on the same box as the new weapon to pick up.
            player.previousPosition = new Position(x, y); // we memorize the previous x and y positions of the current player, the box where the previously held weapon will be located

            player.weapon.id = currentWeapon;
        }

        for (let weapon in weapons) {
            for (let gamer of this.players) {
                if (gamer.weapon.id === weapons[weapon].id) {
                    gamer.nameWeapon = weapons[weapon].nameWeapon;
                    gamer.damagePoint = weapons[weapon].damagePoint;
                    gamer.visual = weapons[weapon].visual;
                    gamer.typeWeapon = weapons[weapon].typeWeapon;
                }
            }
        }

        playerPosition.x = x;
        playerPosition.y = y;
        this.grid[x][y] = new Box(player.id, types.PLAYER);
        this.clear();
        this.display(player);
    }

    /**
     * @method switchPlayer
     * Generic method to change player, executed in the "display" method of the "Game" class.
     * execute the "markBoxesAllowedForMoves" and "display (player)" methods
     * @param {number} player - current player
     */
    switchPlayer(player) {
        this.markBoxesAllowedForMoves(player);
        this.display(player);
    }

    /**
     * @method clear
     * method that removes obstacles, weapons and players from the grid
     * remove all html classes from boxes
     */
    clear() {
        for (let x = 0; x < this.numberOfColumn; x++) {
            for (let y = 0; y < this.numberOfRow; y++) {
                const currentBox = this.grid[x][y];
                currentBox.isEligibleForMove = false;

                let box = $('#box-' + x + "-" + y);
                box.removeClass();
            }
        }
    }

    /**
     * @method display
     * update the affected html classes to display the boxes allowed to move for each player
     * @param {number} player - current player
     */
    display(player) {
        for (let x = 0; x < this.numberOfColumn; x++) {
            for (let y = 0; y < this.numberOfRow; y++) {
                let box = $('#box-' + x + "-" + y);
                if (this.grid[x][y].isEligibleForMove) {
                    box.addClass("allowed-player-move");
                    box.addClass("allowed-player-" + player.id + "-move");
                }
                box.addClass(this.grid[x][y].type);
                if (this.grid[x][y].id) {
                    box.addClass(this.grid[x][y].type + this.grid[x][y].id);
                }
            }
        }
    }

    /**
     * @method hideAllowedPlayerMove
     * allows you to remove the html classes from the boxes allowed to move when the players are side by side.
     * executed in the "playersSideBySide" method.
     */
    hideAllowedPlayerMove() {
        for (let x = 0; x < this.numberOfColumn; x++) {
            for (let y = 0; y < this.numberOfRow; y++) {
                let box = $('#box-' + x + "-" + y);
                if (this.grid[x][y].isEligibleForMove) {
                    this.grid[x][y].isEligibleForMove = false;
                    box.removeClass("allowed-player-move");
                    box.removeClass("allowed-player-1-move");
                    box.removeClass("allowed-player-2-move");
                }
            }
        }
    }

    /**
     * @method playersSideBySide
     * creates html elements when players are side by side.
     * execute the "hideAllowedPlayerMove" method.
     * @param {Array} playerArray - players array created in the class Game.
     */
    playersSideBySide(playerArray) {
        const positionPlayer1 = parseInt(this.playerPosition[1].y + "" + this.playerPosition[1].x);
        const positionPlayer2 = parseInt(this.playerPosition[2].y + "" + this.playerPosition[2].x);
        const positionXplayer1 = this.playerPosition[1].x;
        const positionXplayer2 = this.playerPosition[2].x;
        
        if (Math.abs(positionPlayer1 - positionPlayer2) === 1 || Math.abs(positionPlayer1 - positionPlayer2) === 10) {
            if (positionXplayer1 !== 0 || positionXplayer2 !== 9) {
                if (positionXplayer1 !== 9 || positionXplayer2 !== 0) {
                    let divRow = '<div>';
                    let divCol = '<div>';
                    let h1 = '<h1>';
                    let h4 = '<h4>';
                    
                    $(divRow).prependTo($('.section1')).addClass('row').addClass('fightToDeath').addClass('text-center');
                    $(divCol).appendTo($('.fightToDeath')).addClass('col-lg-12').addClass('combatAlert');
                    $(h1).appendTo('.combatAlert').html('Players fight until the end !!!').addClass('animate__animated animate__flash');
                    $('<i class="fas fa-exclamation-triangle"></i>').insertBefore('.fightToDeath h1').addClass('animate__animated animate__flash');
                    $(h4).appendTo('.combatAlert').html('May the best win...').addClass('animate__animated animate__flash');

                    this.hideAllowedPlayerMove();

                    for (let player of playerArray) {
                        $('<button>').insertAfter('#player-' + player.id).attr('type', 'button').addClass('attackPlayer' + player.id).html('Attack').css('background-color', player.colorPlayer);
                        $('<button>').insertAfter('.attackPlayer' + player.id).attr('type', 'button').addClass('defensePlayer' + player.id).html('Defense').css('background-color', player.colorPlayer);
                    }
                }
            }
        } else {
            $('.fightToDeath').remove();
        }
    }
}