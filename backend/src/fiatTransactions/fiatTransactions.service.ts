import prisma from "../../db/connect";
import PaystackService from "../../services/paystack.service";
import {PlayerNotif} from "../../utils/notifications";
import {TRANSACTION_STATUS, TRANSACTION_TYPE} from "../../utils/enum";
import {convertNairaToCowryOnDeposit} from "../../utils/util";
import CowryTransactionsService from "../cowry/transactions/cowryTransactions.service";

const paystackService = new PaystackService()
const cowryTransactionService = new CowryTransactionsService()

export default class FiatTransactionsService {
    async getFiatTransactions() {
        try {
            const ngnTransactions = await prisma.nairaFiatTransactions.findMany()
            console.log({ngnTransactions})
            return ngnTransactions
        } catch (e: any) {
            throw Error(e)
        }
    }

    async getFiatTransactionByPlayer(playerId: number) {
        try {
            return await prisma.nairaFiatTransactions.findMany({where: {playerId: playerId}})
        } catch (e: any) {
            throw Error(e)
        }
    }

    // we could store reference on client and check last transaction but also check if both references
    // are the same before we then proceed to change the status of the transaction to successful
    async confirmFiatTransaction(playerId: number) {
        try {
            const lastTransaction = await prisma.nairaFiatTransactions.findFirst({
                where: {playerId},
                orderBy: {id: 'desc'}
            })

            if (!lastTransaction) throw new Error('No last transaction! How did you get here?')

            // console.log({lastTransaction})
            if (lastTransaction.status === TRANSACTION_STATUS.SUCCESSFUL) return null

            const transactionSuccessful = await paystackService.verifyTransaction(lastTransaction.reference)
            console.log({transactionSuccessful})
            if (!transactionSuccessful) throw new Error(PlayerNotif.TransactionNotVerified)

            const updatedTransaction = await prisma.$transaction(async _prisma => {
                const confirmedTransaction = await _prisma.nairaFiatTransactions.update({
                    where: {
                        id: lastTransaction.id
                    },
                    data: {
                        status: TRANSACTION_STATUS.SUCCESSFUL
                    }
                })

                const cowry = await _prisma.cowry.findFirst()
                if (!cowry) throw new Error('Game currency not found!')

                const cowryToAdd = convertNairaToCowryOnDeposit(lastTransaction.amount, cowry.rateToNaira)
                // console.log({cowryToAdd})

                const updatedCowry = await _prisma.cowry.update({
                    where: {id: cowry.id},
                    data: {
                        totalSupply: {increment: cowryToAdd}
                    }
                })
                
                // const cowryTransaction = await _prisma.cowryTransactions.create({
                //     data: {
                //         playerId: playerId,
                //         amount: cowryToAdd,
                //         transactionType: TRANSACTION_TYPE.DEPOSIT,
                //         referenceId: lastTransaction.reference,
                //         cowryId: cowry.id
                //     }
                // })
                
                const cowryTransaction = await cowryTransactionService.newCowryTransaction(playerId, cowryToAdd, TRANSACTION_TYPE.DEPOSIT, lastTransaction.reference)

                console.log({updatedCowry, confirmedTransaction})

                return _prisma.player.update({
                    where: {id: playerId},
                    data: {
                        cowryBalance: {increment: cowryToAdd}
                    }
                });
            })
            console.log({updatedTransaction})
            return updatedTransaction
        } catch (e: any) {
            throw Error(e)
        }
    }
}