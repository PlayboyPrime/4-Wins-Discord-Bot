const Discord = require("discord.js")
const Canvas = require("canvas")
const { Player, Game, Result } = require("./Game")
const { token, startTurn, boardWidth, boardHeight } = require("./config")

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
})
client.login(token)

client.on("ready", () => {
    client.application.commands.set([
        new Discord.SlashCommandBuilder()
            .setName("play")
            .setDescription("Play a game")
    ])

    console.log("Bot is online")
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== "play")
        return

    try {
        var game = new Game(startTurn, boardWidth, boardHeight)
    }
    catch (error) {
        return interaction.reply({ content: error.message, ephemeral: true })
    }

    async function drawBoard() {
        const canvas = Canvas.createCanvas(game.boardWidth * 50, game.boardHeight * 50 + 50)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, game.boardWidth * 50, game.boardHeight * 50 + 50)

        ctx.fillStyle = "#ffffff"
        ctx.font = "20px sans-serif"
        for (let i = 0; i < game.boardWidth; i++) {
            const x = i * 50

            let textSize = ctx.measureText(i + 1).width
            ctx.fillText(i + 1, x + 25 - textSize / 2, 30)
        }


        for (let i = 0; i < game.board.length; i++) {
            for (let j = 0; j < game.board[i].length; j++) {
                const x = j * 50
                const y = i * 50 + 50
                const field = game.board[i][j]

                ctx.fillStyle = ["#ffffff", "#ff0000", "#0000ff"][field]
                ctx.beginPath()
                ctx.arc(x + 25, y + 25, 20, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
            }
        }

        let winner = game.checkWin()
        if (winner !== Result.None) {
            ctx.fillStyle = [
                "rgba(255,0,0,0.7)",    // Result.Red
                "rgba(0,0,255,0.7)",    // Result.Blue
                "rgba(0,0,0,0.7)"       // Result.Draw
            ][winner - 1]

            ctx.fillRect(0, 0, game.boardWidth * 50, game.boardHeight * 50 + 50)
        }

        return new Discord.AttachmentBuilder()
            .setName("board.png")
            .setFile(await canvas.toBuffer("image/png"))
    }
    /**  @type {Discord.Message} */
    let msg = await interaction.reply({
        content: game.currentTurn === Player.Red ? "Its red's turn" : "Its blues's turn",
        fetchReply: true, files: [await drawBoard()]
    })

    const collector = msg.channel.createMessageCollector({
        filter: message => message.author.id === interaction.user.id
    })

    collector.on("collect", async message => {
        message.delete()

        const x = parseInt(message.content)
        try {
            var winner = game.makePlay(x - 1)
        }
        catch (error) {
            return msg.edit({ content: error.message })
        }

        if (winner === Result.None)
            return msg.edit({
                content: game.currentTurn === Player.Red ? "Its red's turn" : "Its blue's turn",
                files: [await drawBoard()]
            })

        collector.stop()
        msg.edit({
            content: ["Red has won", "Blue has won", "Its a draw"][winner - 1],
            files: [await drawBoard()]
        })
    })
})