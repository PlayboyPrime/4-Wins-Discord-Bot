type Board = Player[][]

export enum Player {
    None,
    Red,
    Blue
}

export enum Result {
    None,
    Red,
    Blue,
    Draw
}

export class Game {
    currentTurn: Player
    board: Board
    boardWidth: number
    boardHeight: number

    checkWin(): Result {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const player = this.board[y][x]
                if (player === Player.None) {
                    continue
                }

                if (this.board[y][x + 1] === player && this.board[y][x + 2] === player && this.board[y][x + 3] === player) {
                    return player as unknown as Result
                }

                if (this.board[y + 1] && this.board[y + 1][x] === player && this.board[y + 2] && this.board[y + 2][x] === player && this.board[y + 3] && this.board[y + 3][x] === player) {
                    return player as unknown as Result
                }

                if (this.board[y + 1] && this.board[y + 1][x + 1] === player && this.board[y + 2] && this.board[y + 2][x + 2] === player && this.board[y + 3] && this.board[y + 3][x + 3] === player) {
                    return player as unknown as Result
                }

                if (this.board[y + 1] && this.board[y + 1][x - 1] === player && this.board[y + 2] && this.board[y + 2][x - 2] === player && this.board[y + 3] && this.board[y + 3][x - 3] === player) {
                    return player as unknown as Result
                }
            }
        }

        if (this.board.every(row => row.every(cell => cell !== Player.None))) {
            return Result.Draw
        }

        return Result.None
    }

    makePlay(x: number): Result {
        if (isNaN(x) || x < 0 || x >= this.boardWidth -1 || this.board[0][x] !== Player.None) {
            throw new Error('Invalid move')
        }

        let top = -1
        for (let i = this.boardHeight - 1; i >= 0; i--) {
            if (this.board[i][x] === Player.None) {
                top = i
                break
            }
        }

        this.board[top][x] = this.currentTurn
        this.currentTurn = this.currentTurn === Player.Red ? Player.Blue : Player.Red

        return this.checkWin()
    }

    constructor(firstTurn: Player = Player.None, boardWidth: number = 8, boardHeight: number = 5) {
        if (!(firstTurn in Player))
            throw new Error('Invalid first turn')

        if ([boardWidth, boardHeight].some(number => isNaN(number) || number < 4))
            throw new Error('Invalid board size')

        this.boardWidth = boardWidth
        this.boardHeight = boardHeight
        this.currentTurn = firstTurn || Math.random() > 0.5 ? Player.Red : Player.Blue
        this.board = new Array(boardHeight).fill(Player.None).map(() => new Array(boardWidth).fill(Player.None))
    }
}