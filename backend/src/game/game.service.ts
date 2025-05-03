import { NextFunction, Request, Response } from "express";
import prisma from "../../db/connect";
import { GameDataProps } from "./game.types";
import { GameRouterMessages, GameStatRouterMessages, PlayerNotif, PotRouterMessages, TransferNotif } from "../../utils/notifications";
import PlayerService from "../player/player.service";

const playerService = new PlayerService()

export default class GameService {
    /**
     * Fetches all Games within db
     */
    async getGames() {
        try {
            return await prisma.game.findMany({})
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Fetches single Game  within db
     */
    async getSingleGame(playerId: number) {
        try {
            const _game = await prisma.game.findFirstOrThrow({ where: { id: playerId }, include: { players: true, pot: true } })
            return {
                id: _game.id,
                potId: _game.potId,
                gameover: _game.gameover,
                startDate: _game.startDate,
                endDate: _game.endDate,
                // isOpen: _game.isOpen,
                totalWin: _game.totalWin,
                players: _game.players,
                potFee: _game.pot.potFee
            }
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Create new game tied with a pot. Players can join this game
     */
    async createGame(potId: number) {
        try {
            // create new game
            const _pot = await prisma.pot.findUnique({ where: { id: potId } }) // pot for game
            // console.log({_pot})

            function checkPotStatus(startDate: Date, closeDate: Date) {
                const today = new Date()
                const todayInTime = today.getTime()
                const startThreshbold = today.setMinutes(today.getMinutes() + 10)
                const startDateInTime = new Date(startDate).getTime()
                const closeDateInTime = new Date(closeDate).getTime()
                let isPotOpen = false, isGameValid = false;
                // console.log({startDate, startThreshbold, closeDate, startTime: new Date(startDate).getTime(), closeTime: new Date(closeDate).getTime()});
                console.log({ closeDate, startDate, startDateInTime, closeDateInTime, startThreshbold, todayInTime });
                // game open date has to be in the future, atleast 10 minutes into the future
                // 10 minutes minimum threshold
                // console.log({startThreshbold, today, startDate: new Date(startDate).getTime()});

                isGameValid = (startThreshbold > todayInTime) && (todayInTime < closeDateInTime)

                // console.log({today, start: new Date(startDate).getTime(), startDate, startThreshbold})
                // if (startDate)
                isPotOpen = isGameValid && closeDateInTime > todayInTime ? true : false

                console.log({ isPotOpen, isGameValid, closeDate });

                return {
                    isGameValid,
                    isPotOpen
                }
            }

            // check if a game has been created using the same pot ID using the same open and close time

            const { isPotOpen, isGameValid } = checkPotStatus(_pot?.potOpen, _pot?.potClose)

            if (!_pot) {
                throw Error(PotRouterMessages.PotUnavailable)
            }

            if (!isGameValid) throw Error(GameRouterMessages.Invalid)

            if (!isPotOpen) throw Error(PotRouterMessages.Closed)

            const newGame = await prisma.game.create({
                data: {
                    potId: potId,
                    startDate: _pot.potOpen,
                    endDate: _pot.potClose,
                }
            })
            console.log({ newGame });
            return newGame
        } catch (error: any) {
            throw Error(error)
        }
    }
    
    
    /**
     * Player can join a game and participate
     */

    async playerJoinPotGame(playerId: number, gameId: number) {
        try {

            // check if player exists within the GAME

            const _player = await prisma.player.findUniqueOrThrow({
                where: { id: playerId }
            })

            if (!_player) throw Error(PlayerNotif.NotFound) // Check if player exists and respond with appropriate error message

            const _game = await prisma.game.findUniqueOrThrow({
                where: { id: gameId }
            })
            if (!_game) throw Error(GameRouterMessages.GameNotFound)  // Check if pot exists and respond with appropriate error message

            const _pot = await prisma.pot.findUniqueOrThrow({
                where: { id: _game.potId }
            })
            if (!_pot) throw Error(PotRouterMessages.PotNotFound)  // Check if pot exists and respond with appropriate error message

            if (_pot.potFee > _player.cowryBalance) throw Error(TransferNotif.InsufficientFunds)

            const newBalance = await playerService.deductCowryBalance(playerId, _pot.potFee)

            // include other checkers

            // add player to Game
            console.log('Adding Player to game & vice versa', newBalance)

            // update the player
            const updatedPlayer = await prisma.player.update({
                where: { id: playerId },
                data: {
                    games: {
                        connect: { id: gameId }
                    }
                }
            })

            // update the game by increasing totalWin and connected players
            const updatedGame = await prisma.game.update({
                where: { id: gameId },
                data: {
                    players: {
                        connect: { id: playerId }
                    },
                    totalWin: { increment: _pot.potFee }
                }
            })
            // console.log({ updatedPlayer, updatedGame });
            return { updatedPlayer, updatedGame }
        } catch (error: any) {
            throw Error(error)
        }
    }

    async editGame() { }

    async putGameOnHold() { }

    async gamesCreatedByPlayer(playerId: number) {
        try {
            const _player = await prisma.player.findFirstOrThrow({ where: { id: Number(playerId) }, include: { games: true } })
            console.log('Games Created By Player', { _player, games: _player.games });
            return _player.games
        } catch (error: any) {
            throw Error(error)
        }
    }

    async deleteGame(gameId: number) {
        try {
            const _game = await prisma.game.delete({ where: { id: gameId } })
            return _game
        } catch (error: any) {
            throw Error(error)
        }
    }
}