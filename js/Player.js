/**
 * Player class
 * @class
 * @property {number} Player.previousPosition - Memorizes the player's position when picking up a new weapon
 * @property {number} Player.previousWeaponId - Remembers the previous weapon id when the player picks up a new weapon
 * @property {boolean} Player.defense - defines whether a player is defending or not
 * @property {boolean} Player.gameOver - defines whether the game is over or not
 * @constructor
 * @param {number} idPlayer - player id
 * @param {string} namePlayer - player name
 * @param {string} colorPlayer - player color
 * @param {number} weapon - player weapon
 */
class Player {
    previousPosition;
    previousWeaponId;
    defense = false;
    gameOver = false;

    constructor(id, namePlayer, colorPlayer, lifePoint, weapon) {
        this.id = id;
        this.namePlayer = namePlayer;
        this.colorPlayer = colorPlayer;
        this.lifePoint = lifePoint;
        this.weapon = weapon;
    }
}