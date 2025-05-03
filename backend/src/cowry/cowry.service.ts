import prisma from "../../db/connect";
import CowryTransactionsService from "./transactions/cowryTransactions.service";


const cowryTransactionService = new CowryTransactionsService()
export default class CowryService {
    async createGameCurrency () {
        try {
            const cowry = await prisma.cowry.create({
                data: {
                    totalSupply: 0
                }
            })
            console.log({cowry})
            return cowry
        } catch (error: any) {
            throw Error(error)
        }
    }
    async getTotalSupply() {
        try {
            const cowry = await prisma.cowry.findFirst()
            if (!cowry) throw Error('Game Currency Needs To Be Created!')
            return cowry.totalSupply
        } catch (error) {
            throw Error(error)
        }
    }
    
    
    async getCowry() {
        try {
            const cowry = await prisma.cowry.findFirst({include: {transactions: true}})
            if (!cowry) throw Error('Game Currency Needs To Be Created!')
            return cowry
        } catch (error) {
            throw Error(error)
        }
    }
    

    /**
     * When a player tops up their account, Cowry is generated for them.
     * The amount of generated Cowries are added to the supply a Cowry
     * transaction is recorded.
     * @param playerId
     * @param amount
     * @param transactionType
     */
    async generateCowry(playerId: number, amount: number, transactionType = "deposit") {
        try {
            const cowry = await prisma.cowry.findFirst()
            if (!cowry) throw Error('Create Game Currency!')
            
            const cowryTransaction = await prisma.$transaction(async (_prisma) => {
                const transaction = await cowryTransactionService.newCowryTransaction(playerId, amount, "deposit")
                
                
                const updatedCowrySupply = await _prisma.cowry.update({
                    where: {id: cowry.id},
                    data: {
                        totalSupply: {increment: amount}
                    }
                })
                console.log({transactionNow: transaction, updatedCowrySupply}, 'Updates made')
                return "something"
            })
            console.log({cowryTransaction})
            // create a cowry transaction with the type deposit
        //     we increase the totalSupply by the amount
        } catch (error) {
            throw Error(error)
        }
    }


    /**
     * When a user wants to convert their Cowries into naira and withdraw.
     * This method deducts the amount they're withdrawing from the total 
     * supply only and records the transaction.
     * @param recipient
     * @param amount
     */
    async withdrawToNaira(recipient: number, amount: number) {}   
    
    
    async changeWithdrawalRate(newRate: float) {}
    
    async changeRateToNaira(newRate: float) {}
    // async withdrawCowry() {}
}