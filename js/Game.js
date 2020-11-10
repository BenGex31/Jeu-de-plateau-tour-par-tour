
/**
 * Game class
 * @class
 * @constructor
 * @property {Array} - grid array
 * @property {Array} - players array
 * @property {number} - current player
 */
class Game {

    grid;
    players = [];
    currentPlayer;


    constructor() {
    }

    /**
     * @method play
     * creates new instances of the "Player" class in the this.players array
     * creates a new instance of the Grid class
     * executes the initGrid, generateRandomBoxes and generateGrid methods of the Grid class
     * randomly defines the player who starts playing
     * executes the markBoxesAllowedForMoves method of the Grid class
     * executes thes display, attack and defense methods
     */
    play() {
        this.players = [
            new Player(1, "Sam Flynn", "#04cccc", 100, weapons[0]),
            new Player(2, "Tron", "#f99f05", 100, weapons[1])
        ];

        this.grid = new Grid(10, 10, 10, this.players);

        this.grid.initGrid();
        this.grid.generateRandomBoxes();
        this.grid.generateGrid();

        let randomPlayerBegin = Math.floor(Math.random() * this.players.length);
        this.currentPlayer = this.players[randomPlayerBegin];
        $('#infoPlayer' + this.currentPlayer.id).addClass('currentPlayer' + this.currentPlayer.id);

        this.grid.markBoxesAllowedForMoves(this.currentPlayer);

        this.display();

        this.attack();

        this.defense();

        console.log(this.grid);
    }

    /**
     * @method display
     * displays player and weapon information on the html page by interacting with the DOM thanks to Jquery selectors and "click" event.
     * defines the new x and y coordinates of the current player
     */
    display() {
        this.grid.display(this.currentPlayer);

        for (let player of this.players) {
            $('#namePlayer' + player.id).html('Name: ' + player.namePlayer);
            $('#life-point-p' + player.id).html('Life point: ' + player.lifePoint).css('color', player.colorPlayer).css('font-weight', 'bold');
            $('#img-player' + player.id).attr('src', player.visual);
        }

        for (let weapon of weapons) {
            $('#color-weapon-p' + weapon.id).html(weapon.typeWeapon + " " + 'weapon: ' + weapon.nameWeapon);
            $('#damagePointWeaponP'+ weapon.id).html('Damage point : ' + weapon.damagePoint).css('color', 'red');
            $('#img-weapon-p' + weapon.id).addClass('weapon weapon' + weapon.id);

            $('#grid').on("click",".weapon"+ weapon.id + ".allowed-player-move", function() {
                $('#color-weapon-p' + self.currentPlayer.id).html(weapon.typeWeapon + " " + 'weapon: ' + weapon.nameWeapon);
                $('#damagePointWeaponP' + self.currentPlayer.id).html('Damage point : ' + weapon.damagePoint);
            });
        }

        const self = this;
        const playerArray = this.players;
        $("#grid").on("click", ".allowed-player-move", function() {
            const x = parseInt($(this).attr('id').split("-")[1]); // divides the string of the HTML tag "td" which responds to the "click" event and which has the identifier "box-x-y", and parses this string to return an integer
            const y = parseInt($(this).attr('id').split("-")[2]); // idem

            self.grid.movePlayer(self.currentPlayer, x, y);
            
            $('#img-weapon-p' + self.currentPlayer.id).removeClass();
            $('#img-weapon-p' + self.currentPlayer.id).addClass('weapon weapon' + self.currentPlayer.weapon.id);
            
            self.currentPlayer = self.currentPlayer.id === 1 ? self.players[1] : self.players[0]; // ternary operator -> If yes, player 2, otherwise player 1

            self.grid.switchPlayer(self.currentPlayer);

            self.grid.playersSideBySide(playerArray);
        });

        $('#grid').on('click', '.allowed-player-1-move', function() {
            $('#infoPlayer1').removeClass('currentPlayer1');
            $('#infoPlayer2').addClass('currentPlayer2');
            $('.player2').addClass('currentPlayer2');
            $('.attackPlayer1').attr('disabled', 'disabled');
            $('.attackPlayer2').removeAttr('disabled');
            $('.defensePlayer1').attr('disabled', 'disabled');
            $('.defensePlayer2').removeAttr('disabled');
        });

        $('#grid').on('click', '.allowed-player-2-move', function() {
            $('#infoPlayer2').removeClass('currentPlayer2');
            $('#infoPlayer1').addClass('currentPlayer1');
            $('.player1').addClass('currentPlayer1');
            $('.attackPlayer2').attr('disabled', 'disabled');
            $('.attackPlayer1').removeAttr('disabled');
            $('.defensePlayer2').attr('disabled', 'disabled');
            $('.defensePlayer1').removeAttr('disabled');
        });
    }

    /**
     * @method clickAttackPlayer1
     * 
     */
    clickAttackPlayer1() {
        const playerArray = this.players;

        $('#infoPlayer1').on('click', '.attackPlayer1', function() {
            $('#infoPlayer1').removeClass('currentPlayer1');
            $('#infoPlayer2').addClass('currentPlayer2');
            $('.player2').addClass('currentPlayer2').addClass('animate__animated animate__heartBeat');
            $('.player1').removeClass('currentPlayer1').removeClass('animate__animated animate__heartBeat');
            $('.attackPlayer1').attr('disabled', 'disabled');
            $('.attackPlayer2').removeAttr('disabled');
            $('.defensePlayer1').attr('disabled', 'disabled');
            $('.defensePlayer2').removeAttr('disabled');

            if (playerArray[1].defense === false) {
                playerArray[1].lifePoint = playerArray[1].lifePoint - playerArray[0].damagePoint;
                $('#life-point-p2').html('Life point : ' + playerArray[1].lifePoint);
            } else {
                playerArray[1].lifePoint = playerArray[1].lifePoint - (playerArray[0].damagePoint / 2);
                playerArray[1].defense = false;
                $('#life-point-p2').html('Life point : ' + playerArray[1].lifePoint);
            }
            
            $('.DefenseP2').remove();
            $('#damagePointWeaponP1').html('Damage point : ' + playerArray[0].damagePoint);

            if (playerArray[1].lifePoint <= 0) {
                playerArray[1].gameOver = true;
                playerArray[1].lifePoint = 0;
            }

            if (playerArray[1].gameOver === true) {
                $('#life-point-p' + playerArray[1].id).html('Life point : ' + playerArray[1].lifePoint);
    
                for (let player in playerArray) {
                    $('.attackPlayer' + playerArray[player].id).remove();
                    $('.defensePlayer' + playerArray[player].id).remove();
                    $('#infoPlayer' + playerArray[player].id).removeClass('currentPlayer' + playerArray[player].id);
                }
                
                $('#infoPlayer1').removeClass('animate__slow').removeClass('animate__fadeInRight').addClass('animate__flash');
                $('.section1 .fightToDeath').removeClass('fightToDeath').addClass('combatResult');
                $('.combatAlert i').remove();
                $('.combatAlert h1').html('Player 1 : ' + playerArray[0].namePlayer +  ' wins !').css('color', 'lightgreen');
                $('.combatAlert h4').html('Congratulations !').css('color', 'lightgreen');
                $('#infoPlayer2').removeClass('animate__fadeInLeft').removeClass('animate__slow').addClass('animate__hinge');
                $('.player2').addClass('animate__animated').addClass('animate__hinge');
            }
        });
    }

    clickAttackPlayer2() {
        const playerArray = this.players;

        $('#infoPlayer2').on('click', '.attackPlayer2', function() {
            $('#infoPlayer2').removeClass('currentPlayer2');
            $('#infoPlayer1').addClass('currentPlayer1');
            $('.player1').addClass('currentPlayer1').addClass('animate__animated animate__heartBeat');
            $('.player2').removeClass('currentPlayer1').removeClass('animate__animated animate__heartBeat');
            $('.attackPlayer2').attr('disabled', 'disabled');
            $('.attackPlayer1').removeAttr('disabled');
            $('.defensePlayer2').attr('disabled', 'disabled');
            $('.defensePlayer1').removeAttr('disabled');

            if (playerArray[0].defense === false) {
                playerArray[0].lifePoint = playerArray[0].lifePoint - playerArray[1].damagePoint;
                $('#life-point-p1').html('Life point : ' + playerArray[0].lifePoint);
            } else {
                playerArray[0].lifePoint = playerArray[0].lifePoint - (playerArray[1].damagePoint / 2);
                playerArray[0].defense = false;
                $('#life-point-p1').html('Life point : ' + playerArray[0].lifePoint);
            }

            $('.DefenseP1').remove();
            $('#damagePointWeaponP2').html('Damage point : ' + playerArray[1].damagePoint);

            if (playerArray[0].lifePoint <= 0) {
                playerArray[0].gameOver = true;
                playerArray[0].lifePoint = 0;
            }

            if (playerArray[0].gameOver === true) {
                $('#life-point-p' + playerArray[0].id).html('Life point : ' + playerArray[0].lifePoint);
    
                for (let player in playerArray) {
                    $('.attackPlayer' + playerArray[player].id).remove();
                    $('.defensePlayer' + playerArray[player].id).remove();
                    $('#infoPlayer' + playerArray[player].id).removeClass('currentPlayer' + playerArray[player].id);
                }
                
                $('#infoPlayer2').removeClass('animate__slow').removeClass('animate__fadeInRight').addClass('animate__flash');
                $('.section1 .fightToDeath').removeClass('fightToDeath').addClass('combatResult');
                $('.combatAlert i').remove();
                $('.combatAlert h1').html('Player 2 : ' + playerArray[1].namePlayer +  ' wins !').css('color', 'lightgreen');
                $('.combatAlert h4').html('Congratulations !').css('color', 'lightgreen');
                $('#infoPlayer1').removeClass('animate__fadeInLeft').removeClass('animate__slow').addClass('animate__hinge');
                $('.player1').addClass('animate__animated').addClass('animate__hinge');
            }
        });
    }

    attack() {
        this.clickAttackPlayer1();
        this.clickAttackPlayer2();
    }

    defense() {
        const playerArray = this.players;

        $('#infoPlayer1').on('click', '.defensePlayer1', function() {
            $('#infoPlayer1').removeClass('currentPlayer1');
            $('#infoPlayer2').addClass('currentPlayer2');
            $('.player2').addClass('currentPlayer2').addClass('animate__animated animate__heartBeat');
            $('.player1').removeClass('currentPlayer1').removeClass('animate__animated animate__heartBeat');
            $('.attackPlayer1').attr('disabled', 'disabled');
            $('.attackPlayer2').removeAttr('disabled');
            $('.defensePlayer1').attr('disabled', 'disabled');
            $('.defensePlayer2').removeAttr('disabled');

            playerArray[0].defense = true;

            $('#damagePointWeaponP2').html('Damage point : ' + (playerArray[1].damagePoint / 2));
        });

        $('#infoPlayer2').on('click', '.defensePlayer2', function() {
            $('#infoPlayer2').removeClass('currentPlayer2');
            $('#infoPlayer1').addClass('currentPlayer1');
            $('.player1').addClass('currentPlayer1').addClass('animate__animated animate__heartBeat');
            $('.player2').removeClass('currentPlayer1').removeClass('animate__animated animate__heartBeat');
            $('.attackPlayer2').attr('disabled', 'disabled');
            $('.attackPlayer1').removeAttr('disabled');
            $('.defensePlayer2').attr('disabled', 'disabled');
            $('.defensePlayer1').removeAttr('disabled');

            playerArray[1].defense = true;

            $('#damagePointWeaponP1').html('Damage point : ' + (playerArray[0].damagePoint / 2));
        });
    }
}
const game = new Game();
game.play();