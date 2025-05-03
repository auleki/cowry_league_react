import {Prisma, Player} from "@prisma/client";
import prisma from "../../db/connect";
import {confirmSuccessfulTopUp} from "../../utils/security";
import {AdminNotif, CowryNotif, PlayerNotif, TransferNotif} from "../../utils/notifications";
import {IBankAccountDetails} from "./player.types";
import {generateUserVerificationToken, hashUserPassword} from "../../utils/util";
import {RegisterProps} from "../auth/auth.types";
import CowryTransactionsService from "../cowry/transactions/cowryTransactions.service";
import {TRANSACTION_STATUS, TRANSACTION_TYPE} from "../../utils/enum";
import axios from "axios";
import {payGatewayAx, showThings} from "../../instances/payGateway";
import PaystackService from "../../services/paystack.service";
import CowryService from "../cowry/cowry.service";

const cowryTrnxService = new CowryTransactionsService()
const paystackService = new PaystackService()
const cowryService = new CowryService()
export default class PlayerService {

    // Create a new player instance
    async createPlayer(data: RegisterProps) {
        try {
            const token = await generateUserVerificationToken('james')
            const hashedPassword = await hashUserPassword(data.password)
            const today = new Date()
            const oneHourLater = new Date(today.getTime() + 60 * 60 * 1000)
            const newPlayer = await prisma.player.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    password: hashedPassword,
                    email: data.email,
                    dateJoined: new Date(),
                    emailVerifiedToken: token,
                    emailVerifiedTokenExpiresAt: oneHourLater
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
    async generatePlayerCowry(id: number, newBalance: number) {
        const IS_ADMIN = true
        try {
            if (!IS_ADMIN) throw Error(AdminNotif.OnlyAdmin)

            const player = await prisma.player.findUnique({
                where: {id},
                select: {cowryBalance: true}
            })

            if (!player) throw Error(PlayerNotif.NotFound)

            // const currentCowryBalance = player.cowryBalance || 0
            // // console.log({ currentCowryBalance });
            // const updatedTransaction = await prisma.$transaction(async (_prisma) => {
            //     const updatedCowryBalance = await prisma.player.update({
            //         where: { id },
            //         data: {
            //             cowryBalance: newBalance + currentCowryBalance
            //         }
            //     })
            //     const cowryTransaction = await cowryTrnxService.newCowryTransaction(id, newBalance, TRANSACTION_TYPE.DEPOSIT)
            //     console.log({updatedCowryBalance, cowryTransaction})
            // })
            // console.log({updatedTransaction})
            // return updatedTransaction;
            return "Topping up..."
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
            // if (!IS_ADMIN) throw Error(AdminNotif.OnlyAdmin)
            const cowry = await cowryService.getCowry()
            const player = await prisma.player.findUnique({
                where: {id},
                select: {cowryBalance: true}
            })
            const currentCowryBalance = player?.cowryBalance || 0

            if ((currentCowryBalance - amount) < 0) throw Error(CowryNotif.InsufficientCowries)
            
            const newCowryTransaction = await prisma.cowryTransactions.create({
                data: {
                    cowryId: cowry.id,
                    playerId: id,
                    transactionType: TRANSACTION_TYPE.SPEND,
                    referenceId: "join-pot",
                    amount,
                }
            })
            console.log({newCowryTransaction})
            const updatedCowryBalance = prisma.player.update({
                where: {id},
                data: {cowryBalance: {increment: -amount}}
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
        console.log({id})
        try {
            return await prisma.player.findFirstOrThrow({
                where: {id},
                include: {games: true}
            })
        } catch (error: any) {
            throw Error(error)
        }
    }

    // Delete created player
    async deleteSinglePlayer(id: number) {
        try {
            return await prisma.player.delete({
                where: {id}
            })
        } catch (error: any) {
            throw Error(error)
        }
    }

    /**
     * Communicate with paystack payment service and send client back a redirect url
     */
    async depositLocalFiat(playerId: number, amount: number, type: TRANSACTION_TYPE) {
        try {

            // const gatewayUrl = `transaction/initialize`
            // const responseData = await payGatewayAx.post(gatewayUrl)
            console.log({playerId, amount, type})
            const transactionUrl = await paystackService.initiateTransaction("kodagiwa@gmail.com", amount)
            // console.log({transactionUrl})
            const createdTransaction = await prisma.nairaFiatTransactions.create({
                data: {
                    playerId,
                    amount,
                    reference: transactionUrl.data.reference || 'N/A',
                    transactionType: TRANSACTION_TYPE.DEPOSIT,
                    accessCode: transactionUrl.data.access_code || 'N/A',
                    authorizationUrl: transactionUrl.data.authorization_url,
                    status: TRANSACTION_STATUS.PENDING
                }
            })
            console.log({createdTransaction})
            return transactionUrl.data.authorization_url
        } catch (error: any) {
            console.log({error})
            throw Error(error)
        }
    }

    async confirmFiatDeposit(referenceId: string) {
        try {
            return await paystackService.verifyTransaction(referenceId)
        } catch (error: any) {
            throw Error(error)
        }
    }

    // async verifyFiatTransaction(referenceId: string | number) {}

    // Player can withdraw funds from their account balance
    async withdrawFiatToBankAccount(playerId: number, withdrawalAmount: number, bankAccountDetails?: IBankAccountDetails) {
        try {
            const player = await prisma.player.findUnique({
                where: {id: playerId},
                select: {nairaBalance: true}
            })

            if (!player) throw Error(PlayerNotif.NotFound)

            const currentFiatBalance = player.nairaBalance

            if ((currentFiatBalance - withdrawalAmount) < 0) throw new Error(TransferNotif.InsufficientFunds)

            const updatedPlayer = await prisma.player.update({
                where: {id: playerId},
                data: {nairaBalance: currentFiatBalance - withdrawalAmount}
            })
            console.log({currentFiatBalance, withdrawalAmount, updatedPlayer});
            return updatedPlayer;
        } catch (error: any) {
            console.log({error});
            throw new Error(error)
        }
    }
}