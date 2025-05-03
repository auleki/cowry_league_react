import prisma from "../../../db/connect";
import {TRANSACTION_TYPE} from "../../../utils/enum";

export default class CowryTransactionsService {
    /**
     * Create a transaction
     */
    async newCowryTransaction(playerId: number, amount: float, type: TRANSACTION_TYPE, referenceId: string) {
        try {
            const cowry = await prisma.cowry.findFirst()
            console.log({cowry, ...arguments})

            if (!cowry) Error('You need to create the cowry currency')

            return await prisma.cowryTransactions.create({
                data: {
                    playerId,
                    amount,
                    transactionType: type,
                    referenceId,
                    cowryId: cowry.id
                }
            })

        } catch (error: any) {
            throw Error(error)
        }
    }

    // async editCowryTransaction () {
    //     try {
    //    
    //     } catch (error: any) {
    //
    //     }
    // }

    async deleteCowryTransaction() {
        try {

        } catch (error: any) {

        }
    }
}