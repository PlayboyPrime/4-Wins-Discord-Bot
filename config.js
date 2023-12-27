const { Player } = require('./Game');

module.exports = {
    /** @type {string} */
    token: "",                 // Discord bot token

    /** @type {Player} */
    startTurn: Player.None,   // The player that starts. Player.Red or Player.Blue or Player.None for random

    /** @type {number} */
    boardWidth: 8,             // The width of the board. Minimum 4

    /** @type {number} */
    boardHeight: 5             // The height of the board. Minimum 4
}