"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Result = exports.Player = void 0;
var Player;
(function (Player) {
    Player[Player["None"] = 0] = "None";
    Player[Player["Red"] = 1] = "Red";
    Player[Player["Blue"] = 2] = "Blue";
})(Player || (exports.Player = Player = {}));
var Result;
(function (Result) {
    Result[Result["None"] = 0] = "None";
    Result[Result["Red"] = 1] = "Red";
    Result[Result["Blue"] = 2] = "Blue";
    Result[Result["Draw"] = 3] = "Draw";
})(Result || (exports.Result = Result = {}));
var Game = /** @class */ (function () {
    function Game(firstTurn, boardWidth, boardHeight) {
        if (firstTurn === void 0) { firstTurn = Player.None; }
        if (boardWidth === void 0) { boardWidth = 8; }
        if (boardHeight === void 0) { boardHeight = 5; }
        if (!(firstTurn in Player))
            throw new Error('Invalid first turn');
        if ([boardWidth, boardHeight].some(function (number) { return isNaN(number) || number < 4; }))
            throw new Error('Invalid board size');
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.currentTurn = firstTurn || Math.random() > 0.5 ? Player.Red : Player.Blue;
        this.board = new Array(boardHeight).fill(Player.None).map(function () { return new Array(boardWidth).fill(Player.None); });
    }
    Game.prototype.checkWin = function () {
        for (var y = 0; y < this.boardHeight; y++) {
            for (var x = 0; x < this.boardWidth; x++) {
                var player = this.board[y][x];
                if (player === Player.None) {
                    continue;
                }
                if (this.board[y][x + 1] === player && this.board[y][x + 2] === player && this.board[y][x + 3] === player) {
                    return player;
                }
                if (this.board[y + 1] && this.board[y + 1][x] === player && this.board[y + 2] && this.board[y + 2][x] === player && this.board[y + 3] && this.board[y + 3][x] === player) {
                    return player;
                }
                if (this.board[y + 1] && this.board[y + 1][x + 1] === player && this.board[y + 2] && this.board[y + 2][x + 2] === player && this.board[y + 3] && this.board[y + 3][x + 3] === player) {
                    return player;
                }
                if (this.board[y + 1] && this.board[y + 1][x - 1] === player && this.board[y + 2] && this.board[y + 2][x - 2] === player && this.board[y + 3] && this.board[y + 3][x - 3] === player) {
                    return player;
                }
            }
        }
        if (this.board.every(function (row) { return row.every(function (cell) { return cell !== Player.None; }); })) {
            return Result.Draw;
        }
        return Result.None;
    };
    Game.prototype.makePlay = function (x) {
        if (isNaN(x) || x < 0 || x >= this.boardWidth - 1 || this.board[0][x] !== Player.None) {
            throw new Error('Invalid move');
        }
        var top = -1;
        for (var i = this.boardHeight - 1; i >= 0; i--) {
            if (this.board[i][x] === Player.None) {
                top = i;
                break;
            }
        }
        this.board[top][x] = this.currentTurn;
        this.currentTurn = this.currentTurn === Player.Red ? Player.Blue : Player.Red;
        return this.checkWin();
    };
    return Game;
}());
exports.Game = Game;
