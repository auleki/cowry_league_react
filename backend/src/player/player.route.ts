import { Request, Router, Response, NextFunction } from "express";
// import PlayerController from "./player.controller.js";
import PlayerService from "./player.service";
import { PlayerNotif } from "../../utils/notifications";
// import {CHANGE_TYPE} from "@/"
import { PLAYER_CHANGE_TYPE } from "../../utils/enum"
import { DepositCowryParams, DepositParams, WithdrawParams } from "./player.types";
import { extractParamsField } from "../../utils/util";


const playerRouter = Router()
const playerService = new PlayerService()

/**
 * Fetches all players and their stats
 */
playerRouter.get('/all', async (req, res) => {
    try {
        const _allPlayers = await playerService.getAllPlayerStats()
        res.json({ data: _allPlayers })
    } catch (error) {
        res.json({ error })
    }
})

/**
 * Fetches a single player and their stat
 */
playerRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id ?? null
        if (!playerId) res.status(401).json({ message: 'No ID attached' })
        const _player = await playerService.getSinglePlayerStats(Number(playerId)) // playerID used to find player\
        res.json({ player: _player })
    } catch (error) {
        res.json({ error })
    }
})


/**
 * Creates a single Player
 * 
 */
playerRouter.post("/new", async (req: Request, res: Response) => {
    try {
        // take player data and send to player creation service
        const newPlayer = await playerService.createPlayer(req.body) // can include a datacheck to ensure form data has all needed fields
        res.status(201).json({ newPlayer, message: PlayerNotif.PlayerCreated })
    } catch (error) {
        console.error(error)
        res.status(401).json(error)
    }
})

/**
 * Router method Deposits specified fiat amount to Player balance
 * 
 */
playerRouter.patch("/:id/deposit-fiat", async (req: Request<DepositParams>, res: Response, next: NextFunction) => {
    try {
        const playerId = extractParamsField(req, 'id')
        const { amount, type } = req.body as DepositParams
        const updatedPlayer = await playerService.depositLocalFiat(Number(playerId), amount, type)
        console.log({ updatedPlayer });
        res.status(201).json({ updatedPlayer, message: PlayerNotif.UpdatedFiatBalance })
    } catch (error) {
        next(error)
    }
})

/**
 * Router method Withdraws specified fiat amount from Player balance
 * 
 */
playerRouter.patch('/:id/withdraw-fiat', async (req: Request<WithdrawParams>, res: Response, next: NextFunction) => {
    try {
        const playerId = extractParamsField(req, 'id')
        const { amount, type } = req.body as WithdrawParams
        const updatedPlayer = await playerService.withdrawFiatToBankAccount(Number(playerId), amount)
        console.log({ errorFrom: updatedPlayer });
        res.status(200).json({ updatedPlayer, message: PlayerNotif.AmountWithdrawn })
    } catch (error: any) {
        console.error('server::', typeof Object.keys(error))
        next(error)
    }
})

/**
 * Router method to Deposit cowry
 */
playerRouter.patch('/:id/deposit-cowry', async (req: Request<DepositCowryParams>, res: Response, next: NextFunction) => {
    try {
        const playerId = extractParamsField(req, "id")
        const { amount } = req.body as DepositCowryParams
        const updatedBalance = await playerService.topupCowryBalance(+playerId, +amount)
        console.log({ updatedBalance });
        res.status(200).json({ updatedBalance, message: PlayerNotif.DepoitSuccessful })
    } catch (error) {
        next(error)
    }
})

/**
 * Withdraw method to Deduct cowry from Player balance
 */
playerRouter.patch('/:id/withdraw-cowry', async (req: Request<DepositCowryParams>, res: Response, next: NextFunction) => {
    try {
        const playerId = extractParamsField(req, "id")
        const { amount } = req.body as DepositCowryParams
        const updatedBalance = await playerService.deductCowryBalance(+playerId, +amount)
        console.log({ updatedBalance });
        res.status(200).json({ updatedBalance, message: PlayerNotif.WithdrawnCowries })
    } catch (error) {
        next(error)
    }
})

export default playerRouter