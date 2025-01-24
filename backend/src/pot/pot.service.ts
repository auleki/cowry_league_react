import { Prisma, Pot } from "@prisma/client";
import prisma from "../../db/connect";
import { PlayerNotif, PotRouterMessages, TransferNotif } from "../../utils/notifications";
import PlayerService from "../player/player.service";

const playerService = new PlayerService()

export default class PotService {

    /**
     * Create a pot
     */
    async createPot(data: Omit<Pot, 'id'>) {
        try {
            const newPot = await prisma.pot.create({
                data: {
                    potClose: data.potClose,
                    potOpen: data.potOpen,
                    potFee: data.potFee,
                    isOpen: data.isOpen
                }
            })
            return newPot
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getPlayersInPot(potId: number) {
        try {
            const pot = await prisma.pot.findMany({
                include: {
                    player: true
                }
            })
            console.log({ pot })
            return pot
        } catch (error: any) {
            throw Error(error)
        }
    }

    async addPlayerToPot(potId: number, playerId: number) {
        try {
            // check if user exists first
            const _player = await prisma.player.findUniqueOrThrow({
                where: { id: playerId }
            })
            if (!_player) throw Error(PlayerNotif.NotFound) // Check if player exists and respond with appropriate error message

            const _pot = await prisma.pot.findUniqueOrThrow({
                where: { id: potId }
            })
            if (!_pot) throw Error(PotRouterMessages.PotNotFound) // Check if pot exists and respond with appropriate error message

            // & there is no suspension on their account


            // check if player id exists in Pot's blacklisted players

            // check if player has enough to join POT based on POT's fee
            if (_pot.potFee > _player.nairaBalance) throw Error(TransferNotif.InsufficientFunds)

            // remove money from player's account balance
            const newBalance = await playerService.withdrawFiatToBankAccount(playerId, _pot.potFee)
            // include other checkers

            // add player to Pot
            console.log('Adding Player to pot...', newBalance)
            // update the player
            const updatedPlayer = await prisma.player.update({
                where: { id: playerId },
                data: {
                    pot: {
                        connect: { id: potId }
                    }
                }
            })

            // update the pot
            const updatedPot = await prisma.pot.update({
                where: { id: potId },
                data: {
                    player: {
                        connect: { id: playerId }
                    },
                    potPrice: _pot.potPrice + _pot.potFee
                }
            })
            return { updatedPlayer, updatedPot }
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
    * Close or Open pot
    */
    async togglePotStatus(id: number, openPot: boolean) {
        try {
            const pot = await prisma.pot.findUnique({
                where: { id },
            })
            if (!pot) throw Error(PotRouterMessages.PotNotFound)
            const updatedPot = await prisma.pot.update({
                where: { id },
                data: {
                    isOpen: openPot
                }
            })
            return updatedPot
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
    * Update is made to th pot based on selected type
    */
    async getAllPots() {
        try {
            return await prisma.pot.findMany()
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
    * Update is made to th pot based on selected type
    */
    async getSinglePot(id: number) {
        try {
            return await prisma.pot.findFirstOrThrow({
                where: { id },
                include: {
                    player: true
                    // player: {
                    //     select: {
                    //         cowryBalance: true,
                    //         nairaBalance: true,
                    //         firstname: true,
                    //     }
                    // }
                }
            })
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
    * Update is made to th pot based on selected type
    */
    async deletePot(id: number) {
        try {
            return await prisma.pot.delete({
                where: { id }
            })
        } catch (error: any) {
            throw Error(error)
        }
    }
}