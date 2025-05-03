import {NextFunction, Router, Response, Request, RequestHandler} from "express";
import FiatTransactionsService from "./fiatTransactions.service";
import {handleError, handleResponse} from "../../utils/util";

const fiatTxnsRouter = Router()
const fiatTxnsService = new FiatTransactionsService()

fiatTxnsRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await fiatTxnsService.getFiatTransactions()
        handleResponse(res, 200, 'Got all transactions', transactions)
    } catch (e: any) {
        handleError(res, 400, 'Error getting all transactions')
    }
})

type PlayerTransactionProps = {
    id: string;
    playerId: string;
}
fiatTxnsRouter.get('/player-transactions/:playerId', async (req: Request<PlayerTransactionProps>, res: Response, next: NextFunction) => {
    try {
        const params = req.params
        console.log({params})
        const transactions = await fiatTxnsService.getFiatTransactionByPlayer(Number(params.playerId))
        console.log({transactions})
        handleResponse(res, 200, 'Got all transactions', transactions)
    } catch (e: any) {
        handleError(res, 400, 'Error getting player transactions')
    }
})

type ConfirmTransactionParams = {
    playerId: string;
}
const confirmTransactionController: RequestHandler<ConfirmTransactionParams> = async (
    req: Request<ConfirmTransactionParams>,
    res: Response,
    next: NextFunction
) => {

    try {
        const params = req.params
        const confirmedTransaction = await fiatTxnsService.confirmFiatTransaction(Number(params.playerId))
        console.log({confirmedTransaction})
        if (!confirmedTransaction)
            return handleError(res, 400, 'Transaction already verified')


        handleResponse(res, 200, 'Got all transactions', confirmedTransaction)
    } catch (e: any) {
        next(e)
    }
}

fiatTxnsRouter.patch('/confirm-transactions/:playerId', confirmTransactionController)


export default fiatTxnsRouter