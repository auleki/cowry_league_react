import { Prisma, Player } from "@prisma/client";
import prisma from "../../db/connect";
import { confirmSuccessfulTopUp } from "../../utils/security";
import { AdminNotif, CowryNotif, PlayerNotif, TransferNotif } from "../../utils/notifications";
import { IBankAccountDetails } from "./player.types";

export default class PlayerService {
    // constructor() {
    //     this.getAllPlayerStats = this.getAllPlayerStats.bind(this)
    // }

    // Create a new player instance
    async createPlayer(data: Omit<Player, 'id' | 'dateJoined' | 'currentPot'>) {
        try {
            const newPlayer = await prisma.player.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    password: data.password,
                    cowryBalance: 0,
                    nairaBalance: 0,
                    email: data.email,
                    dateJoined: new Date(),
                    currentPot: [],
                }
            })
            return newPlayer;
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Increase Cowry Balance of Player
     * @param id 
     * @param newBalance 
     * @returns 
     */
    async topupCowryBalance(id: number, newBalance: number) {
        const IS_ADMIN = true
        try {
            if (!IS_ADMIN) throw Error(AdminNotif.OnlyAdmin)

            const player = await prisma.player.findUnique({
                where: { id },
                select: { cowryBalance: true }
            })

            if (!player) throw Error(PlayerNotif.NotFound)

            const currentCowryBalance = player.cowryBalance || 0
            console.log({ currentCowryBalance });
            const updatedCowryBalance = prisma.player.update({
                where: { id },
                data: {
                    cowryBalance: newBalance + currentCowryBalance
                }
            })
            return updatedCowryBalance;
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Decrease Cowry Balance of Player
     * @param id 
     * @param amount 
     * @returns 
     */
    async deductCowryBalance(id: number, amount: number) {
        const IS_ADMIN = true;
        try {
            if (!IS_ADMIN) throw Error(AdminNotif.OnlyAdmin)
            const player = await prisma.player.findUnique({
                where: { id },
                select: { cowryBalance: true }
            })
            const currentCowryBalance = player?.cowryBalance || 0

            if ((currentCowryBalance - amount) < 0) throw Error(CowryNotif.InsufficientCowries)

            const updatedCowryBalance = prisma.player.update({
                where: { id },
                data: { cowryBalance: currentCowryBalance - amount }
            })
            return updatedCowryBalance;
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Fetches all Players within database
     * @returns 
     */
    async getAllPlayerStats() {
        try {
            return await prisma.player.findMany()
        } catch (error: any) {
            throw Error(error)
        }
    }

    // Get Siingle Player Stats
    async getSinglePlayerStats(id: number) {
        console.log({ id })
        try {
            return await prisma.player.findFirstOrThrow({
                where: { id },
                include: { games: true }
            })
        } catch (error: any) {
            throw Error(error)
        }
    }

    // Delete created player
    async deleteSinglePlayer(id: number) {
        try {
            return await prisma.player.delete({
                where: { id }
            })
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Increasees the local balance, by taking in the amount being added,but ensuring the money actually went through before approving
     */
    async depositLocalFiat(playerId: number, amount: number, type: 'transfer' | 'ussd') {
        try {
            let updatedPlayerBalance;
            // start the process & also look into payment gateway providers and resources available

            // talk to third-party gateway provider
            const isSuccessful = await confirmSuccessfulTopUp('xxxx xxxx xxxx')

            // Check if amount is number or can be converted
            if (isNaN(amount)) throw Error(PlayerNotif.AmountInvalid)

            if (isSuccessful) {
                // update player fiat balance
                const player = await prisma.player.findUnique({
                    where: { id: playerId },
                    select: { nairaBalance: true }
                })
                if (!player) throw Error(PlayerNotif.NotFound)
                const currentFiatBalance = player.nairaBalance || 0
                // update player balance
                updatedPlayerBalance = await prisma.player.update({
                    where: { id: playerId },
                    data: { nairaBalance: currentFiatBalance + (+amount) }
                })
            } else {
                throw Error(TransferNotif.TopUpFail)
            }
            return {
                updatedPlayerBalance,
                type,
            }
        } catch (error: any) {
            throw Error(error)
        }
    }

    // Player can withdraw funds from their account balance
    async withdrawFiatToBankAccount(playerId: number, withdrawalAmount: number, bankAccountDetails?: IBankAccountDetails) {
        try {
            const player = await prisma.player.findUnique({
                where: { id: playerId },
                select: { nairaBalance: true }
            })

            if (!player) throw Error(PlayerNotif.NotFound)

            const currentFiatBalance = player.nairaBalance

            if ((currentFiatBalance - withdrawalAmount) < 0) throw new Error(TransferNotif.InsufficientFunds)

            const updatedPlayer = await prisma.player.update({
                where: { id: playerId },
                data: { nairaBalance: currentFiatBalance - withdrawalAmount }
            })
            console.log({ currentFiatBalance, withdrawalAmount, updatedPlayer });
            return updatedPlayer;
        } catch (error: any) {
            console.log({ error });
            throw new Error(error)
        }
    }
}