import prisma from "../../db/connect";
import { GameRouterMessages, GameStatRouterMessages, PlayerNotif } from "../../utils/notifications";
import { doesResourceExist, isGameOnCooldown } from "../../utils/util";


export default class GameStatsService {

    /**
    * When user exhausts their lives put them on 1hr timeout where they can't participate in the game
    */
    async putPlayerOnCooldown(gameStatId: number, playerId: number) {
        try {
            // put player on hold
            const _gameStat = await prisma.playerGameStats.findUnique({ where: { id: gameStatId } })
            if (_gameStat && _gameStat.livesLeft !== 0) throw Error(GameStatRouterMessages.PlayerHasLives)
            // doesResourceExist(null, GameRouterMessages.GameNotFound)
            // console.log({gameStatId})
            console.log({currentDateIs: _gameStat?.lastCooldownStartAt});

            const cooldownStatus = _gameStat?.lastCooldownStartAt && isGameOnCooldown(_gameStat?.lastCooldownStartAt)
            
            if (cooldownStatus && cooldownStatus.isCoolingDown) {
                throw Error(`Cooldown ongoing, ${cooldownStatus.remainingMinutes} mins left`)
            }

            const _updatedGameStat = await prisma.playerGameStats.update({
                where: { id: gameStatId },
                data: {
                    lastCooldownStartAt: new Date()
                }
            })

            console.log("Player On Cooldown", { _updatedGameStat })
            return _updatedGameStat
        } catch (error: any) {
            // handle error
            throw Error(error)
        }
    }

    /**
    * Player loses a life when a balloon hits the top of the screen
   */
    async playerLoseLife(gameStatId: number, playerId: number) {
        try {
            const _gameStat = await prisma.playerGameStats.findUnique({ where: { id: gameStatId } })
            let serverMessage = "You lost a life"
            // console.log({gameStatId, _gameStat})
            if (!_gameStat) throw Error(GameStatRouterMessages.CantStartGame)
            if (_gameStat.playerId !== playerId) throw Error(GameStatRouterMessages.PlayerNotInGame)

            if (_gameStat.livesLeft === 0) {
                const playerOnCooldown = await this.putPlayerOnCooldown(_gameStat.id, playerId)
                serverMessage = "You are on cooldown"
                return {
                    message: GameRouterMessages.PlayerOnCooldown,
                    data: playerOnCooldown
                }
            }

            const _statUpdated = await prisma.playerGameStats.update({
                where: { id: gameStatId },
                data: {
                    livesLeft: { decrement: 1 }
                }
            })
            return {
                data: _statUpdated,
                serverResponse: serverMessage
            }
        } catch (error: any) {
            throw Error(error)
        }
    }


    /**
     * Lives are refilled if only the lives are zero and the cooldown time has elapsed
     * @param gameStatId 
     * @param playerId 
     * @returns 
     */
    async refillPlayerLives(gameStatId: number, playerId: number) {
        try {
            const _gameStat = await prisma.playerGameStats.findUnique({ where: { id: gameStatId } })

            // if (_gameStat && _gameStat.livesLeft !== 0) throw Error(GameStatRouterMessages.CantRefillLives)
            doesResourceExist(_gameStat, GameRouterMessages.GameNotFound)
            const hasCooldownElapsed = true;
            isGameOnCooldown(_gameStat?.lastCooldownStartAt)
            //console.log({ _gameStat });
            // return
            if (!hasCooldownElapsed) throw Error(GameStatRouterMessages.CooldownNotElapsed)

            const refilledLives = await prisma.playerGameStats.update({
                where: { id: gameStatId },
                data: {
                    livesLeft: _gameStat?.maxLives
                }
            })
            // console.log({refilledLives});
            return refilledLives
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * 
     * @returns 
     */
    async getGameStats() {
        try {
            return await prisma.playerGameStats.findMany({})
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * 
     * @param gameStatId 
     * @returns 
     */
    async getSingleGameStat(gameStatId: number) {
        try {
            return await prisma.playerGameStats.findFirstOrThrow({ where: { id: gameStatId } })
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * 
     * @param gameId 
     * @param playerId 
     * @returns 
     */
    async createGameStat(gameId: number, playerId: number) {
        try {
            //  check if a pot with that ID has an active game
            let userCanStartGame: boolean = false;
            const _game = await prisma.game.findFirstOrThrow({ where: { id: gameId }, include: { players: true } })
            const isPlayerPartOfGame = _game.players.filter(player => player.id === playerId).length === 1

            // && and also if the user is part of the active games
            const _allGameStats = await prisma.playerGameStats.findMany({})
            console.log({ _game, players: _game.players, isPlayerPartOfGame, _allGameStats });
            if (!isPlayerPartOfGame) {
                throw new Error(GameStatRouterMessages.PlayerNotInGame)
            }

            /**
             * Check for three things. If any is true, the user won't be able to start a new game
             * 1. Does a game with this Id already exist using the exact same pot
             * 2. Is that game still playing and is the game open as well
             * N.B. Pots can only be used once a day
             */
            (function checkGameCreationStatus() {
                // console.log({_allGameStats})
                if (_allGameStats.length === 0 ) {
                    userCanStartGame = true
                    return
                }
                
                const _stats = _allGameStats.filter(gameStat => {
                    if (gameStat.gameId === gameId && playerId === gameStat.playerId) {
                        userCanStartGame = false
                    } else {
                        userCanStartGame = true
                    }
                    return gameStat.gameId === gameId
                })
                if (_stats.length > 1) throw Error('Big Problem while starting game')
            })()
            if (!userCanStartGame) throw Error(GameStatRouterMessages.CantStartGame)

            // create a game here using associated pot details
            const _newGameStat = await prisma.playerGameStats.create({
                data: {
                    game: {
                        connect: { id: gameId }
                    },
                    player: {
                        connect: { id: playerId }
                    },
                },
                include: {
                    game: true,
                    player: true
                }
            })
            console.log({ _newGameStat })
            return _newGameStat;
        } catch (error: any) {
            console.log({error})
            throw Error(error)
        }
    }

    async editGameStats() { }

    /**
     * Update Game Score
     * @param gameStatId 
     * @param playerId 
     */
    async updateGameScore(gameStatId: number, playerId: number, action = 'increment') {
        try {
            // find the gamestat and ensure it was created by this current player
            const _gameExists = (await prisma.playerGameStats.findUnique({ where: { id: gameStatId } }))?.playerId === playerId

            if (!_gameExists) throw Error(GameRouterMessages.GameNotFound)

            console.log({ _gameExists })

            const COWRY_REWARD_PER_BALLOON = 50

            const _updatedGameStat = await prisma.playerGameStats.update(
                {
                    where: { id: gameStatId },
                    data: {
                        popsEarned: { [action]: COWRY_REWARD_PER_BALLOON }
                    }
                }
            )
            console.log({ _updatedGameStat });


            // ensure it is player who is playing the game is who created the gameStat

            // update the player's score

        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * When user pops a balloon some cowries get added to their Cowry balance
     */
    async popBalloon(gameStatId: number, playerId: number) {
        try {
            // get the exact pot via the game
            const _gameStat = await prisma.playerGameStats.findUnique({ where: { id: gameStatId } })
            if (!_gameStat) throw Error(GameRouterMessages.GameNotFound)
            const _game = await prisma.game.findFirstOrThrow({ where: { id: _gameStat.gameId }, include: { players: true } })
            // console.log({ _gameStat, gameStatId, _game, players: _game.players });

            // console.log({ _game, gameover: _game.gameover, players: _game.players });

            function playerFoundInGame() {
                const _playerInGame = _game.players.filter(player => player.id === playerId)

                return _playerInGame.length === 1 ? true : false
            }

            // ensure the game is not over
            if (_game.gameover) {
                // take user to gameover screen

                // then terminate code here
                return
            } 

            let gameOnCooldown = _gameStat.lastCooldownStartAt && isGameOnCooldown(_gameStat.lastCooldownStartAt);
            if (gameOnCooldown && gameOnCooldown.isCoolingDown) {
                // inform user that game session is on cooldown

                // if cooldown session is on throw an error, and don't reward user
                // throw Error(GameRouterMessages.PlayerOnCooldown)
                throw Error(`Cooldown ongoing, ${gameOnCooldown.remainingMinutes} mins left`)
            }

            // ensure player is part of game players
            if (!playerFoundInGame()) throw Error(PlayerNotif.NotFound)

            // increase player's cowries
            const cowryReward: number = _game.minimalReward || 50.00
            const updatedCowries = await prisma.playerGameStats.update({
                where: { id: gameStatId },
                data: {
                    popsEarned: { increment: cowryReward }
                }
            })
            // increase totalCowries earned || or use computation to calculate totalEarned based on cowries earned within participated games
            // increase the difficulty slightly
            return { message: "Cowry earned", data: updatedCowries }
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * 
     * @param gameStatId 
     * @returns 
     */
    async deleteGameStat(gameStatId: number) {
        try {
            const _gameStat = await prisma.playerGameStats.findFirstOrThrow({ where: { id: gameStatId } })
            if (!_gameStat) throw Error(GameRouterMessages.GameNotFound)
            return await prisma.playerGameStats.delete({ where: { id: gameStatId } })
        } catch (error: any) {
            throw Error(error)
        }
    }
}