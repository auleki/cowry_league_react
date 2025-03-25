import { Prisma, Pot } from "@prisma/client";
import prisma from "../../db/connect";
import { GameNotif, PlayerNotif, PotRouterMessages, TransferNotif } from "../../utils/notifications";
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
                }
            })
            return newPot
        } catch (error: any) {
            throw Error(error)
        }
    }

    async closePot(potId: number) {
        // close pot
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
            console.log('error new', error)
            throw Error(error)
        }
    }
}