import { NextFunction, Request, Response, Router } from "express";
import PotService from "./pot.service";
import { PotRouterMessages } from "../../utils/notifications";
import { POT_CHANGE_TYPE } from "../../utils/enum";
import { extractParamsField, extractQueryField } from "../../utils/util"
import PlayerService from "../player/player.service";

/**
 * BUGS []
 * - Possible date bug, ensure the dates are consistent (look more into date and working with customers in different time zones)
 */

const potRouter = Router()
const potService = new PotService()
const playerService = new PlayerService()

type PotParams = {
    id?: string
    type?: POT_CHANGE_TYPE
}

type NewPotParams = {
    potClose: Date
    potOpen: Date
    potFee: number
    isOpen: Boolean
    potSize: []
}

/**
 * Router method Create a new Pot
 * @param potClose Date
 * @param potOpen Date
 * @param potFee Number
 */
potRouter.post('/new', async (req: Request, res: Response) => {
    try {
        const { potClose, potOpen, potFee } = req.body as NewPotParams

        // check if admin is the one creating a POT
        
        const newPot = await potService.createPot({
            potClose: new Date((potClose as any) * 1000), // make this air-tight
            potOpen: new Date((potOpen as any) * 1000),
            isOpen: false,
            potFee,
        })
        res.status(201).json({ data: newPot, message: PotRouterMessages.PotCreated })
    } catch (error) {
        res.json(error)
    }
})

/**
 * Router method fetches all pots and their stats
 */
potRouter.get('/all', async (req, res) => {
    try {
        const _allPots = await potService.getAllPots()
        console.log({ _allPots })
        if (!_allPots.length) {
            res.status(200).json(PotRouterMessages.EmptyPotList)
        } else {
            res.json({ data: _allPots, message: PotRouterMessages.GetAllPots })
        }
    } catch (error) {
        res.json({ error })
    }
})

/**
 * Router method fetches single Pot
 * @query id number
 */
potRouter.get('/:id', async (req: Request<PotParams>, res) => {
    try {
        const id = req.params?.id ?? null
        if (!id && isNaN(Number(id))) res.status(401).json({ message: 'No ID attached' })
        const _singlePot = await potService.getSinglePot(Number(id))
        res.json({ data: _singlePot, message: PotRouterMessages.GetSinglePot })
    } catch (error) {
        res.json({ error })
    }
})

/**
 * This router method closes a POT
 * @param id number
 */
potRouter.patch('/:id/close', async (req: Request, res: Response) => {
    try {
        const potId = extractParamsField(req, "id")
        const closedPot = await potService.togglePotStatus(Number(potId), false)
        console.log({closedPot});
        res.status(200).json({data: closedPot})
    } catch (error) {
        res.status(401).json(error)
    }
})

/**
 * This router method opens a POT
 * @param id number
 */
potRouter.patch('/:id/open', async (req: Request, res: Response) => {
    try {
        const potId = extractParamsField(req, "id")
        const openedPot = await potService.togglePotStatus(Number(potId), true)
        res.status(200).json({data: openedPot})
    } catch (error) {
        res.status(401).json(error)
    }
})

/**
 * Router method Joins a player to the Pot
 */
potRouter.patch('/:id/join', async (req: Request<PotParams>, res: Response, next: NextFunction) => {
    try {
        const potId = Number(extractParamsField(req, "id"))
        const playerId = Number(extractQueryField(req, "player"))
        const _data = await potService.addPlayerToPot(potId, playerId)
        console.log({ _data })
        res.status(200).json({ data: _data })
    } catch (error) {
        next(error)
    }
})

/**
 * Router method Joins a player to the Pot
 */
potRouter.patch('/:id/remove', async (req: Request<PotParams>, res: Response) => {
    try {
        const potId = Number(extractParamsField(req, "id"))
        const playerId = Number(extractQueryField(req, "player"))
        // remove player from POT
        res.status(200).json({ data: {potId, playerId} })
    } catch (error) {
        res.status(401).json({ error })
    }
})


/**
 * Get all players within a pot
 */
potRouter.get('/:id/players', async (req: Request<PotParams>, res: Response) => {
    try {
        // take the pot id and throw it into the service
        const potId = req.params.id && Number(req.params.id)
        if (!potId) throw Error(PotRouterMessages.PotNotFound)
        if (isNaN(Number(potId))) throw Error(PotRouterMessages.InvalidId)
        const potPlayers = await potService.getPlayersInPot(potId)
        console.log({ potPlayers })
        res.status(200).json({ data: potPlayers })
    } catch (error) {
        // responsd with error 
        res.status(401).json(error)
    }
})


/**
 * Fetches single Pot
 */
potRouter.delete('/', async (req: Request<PotParams>, res) => {
    try {
        const id = req.params?.id ?? null
        if (!id && isNaN(Number(id))) res.status(401).json({ message: 'No Pot attached' })
        const deletedPot = await potService.deletePot(Number(id))
        res.json({ data: deletedPot, message: PotRouterMessages.DeletePot })
    } catch (error) {
        res.json({ error })
    }
})

export default potRouter