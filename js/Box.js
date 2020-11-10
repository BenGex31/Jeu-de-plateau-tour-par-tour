/**
 * Box class
 * @class
 * @property {boolean} Box.isEligibleForMove - defines if a box is eligible to move for a player
 * @constructor
 * @param {Number} id - box id
 * @param {string} type - box type
 */
class Box {
    isEligibleForMove = false;

    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}

/**
 * Box type object - lists the types of boxes
 * @constant
 * @type {Object}
 * @property {string} types.OBSTACLE
 * @property {string} types.WEAPON
 * @property {string} types.PLAYER
 * @property {string} types.EMPTY
 * @property {string} types.EMPTY_PLAYER_EXCLUDED - defines an inaccessible box for the opposing player
 */
const types = {
    OBSTACLE: "obstacle",
    WEAPON: "weapon",
    PLAYER: "player",
    EMPTY: "empty",
    EMPTY_PLAYER_EXCLUDED: "empty player-excluded"
};