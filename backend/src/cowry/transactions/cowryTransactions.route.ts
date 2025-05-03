import {Request, Router, Response, NextFunction} from "express";
import CowryTransactionsService from "./cowryTransactions.service";
import {TRANSACTION_TYPE} from "../../../utils/enum";
import {handleResponse} from "../../../utils/util";
// import { PlayerNotif } from "../../utils/notifications";
// import {DepositCowryParams, DepositParams, VerifyDepositParams, WithdrawParams} from "./player.types";
// import {extractParamsField, handleResponse} from "../../utils/util";

const cowryTxnRouter = Router()
const cowryTxnService = new CowryTransactionsService()

type NewCowryTransactionParams = {
    playerId: number;
    amount: number;
    type: TRANSACTION_TYPE
}
cowryTxnRouter.post("/new", async (req: Request<NewCowryTransactionParams>, res: Response, next: NextFunction) => {
    try {
        const {playerId, amount, type} = req.body as NewCowryTransactionParams
        console.log({params: req.params})
        const newCowryTxn = await cowryTxnService.newCowryTransaction(playerId, amount, type, 'pystk')
        console.log({newCowryTxn})
        handleResponse(res, 201, 'Cowry transaction created', newCowryTxn)
    } catch (error) {
        console.error(error)
        res.status(401).json(error)
    }
})

export default cowryTxnRouter