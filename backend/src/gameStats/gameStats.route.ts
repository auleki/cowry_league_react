import { NextFunction, Request, Response, Router } from "express";
import GameStatsService from "./gameStats.service";

const gameStatRouter = Router()
const gameStatsService = new GameStatsService()

/**
 * Fetches all game stats
 */
gameStatRouter.get('/all', async (_: Request, res: Response, next: NextFunction) => {
    try {
        const gameStats = await gameStatsService.getGameStats()
        res.status(200).json({ data: gameStats })
    } catch (error) {
        next(error)
    }
})

export type GetSingleStatProps = {
    id: number
}
/**
 * Fetches single Game Stat using Game Stat Service
 */
gameStatRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        res.status(200).json({ data: await gameStatsService.getSingleGameStat(Number(id)) })
    } catch (error: any) {
        next(error)
    }
})

/**
 * Create a Game Stat using Game Stat Service
 */
export type GameStatProps = {
    gameId: number;
    playerId: number;
}
gameStatRouter.post('/new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameId, playerId } = await req.body as GameStatProps
        console.log({playerId})
        const newGameStat = await gameStatsService.createGameStat(gameId, playerId)
        res.status(201).json({ data: newGameStat })
    } catch (error: any) {
        next(error)
    }
})

/**
 * Update a single Game Stat using Game Stat Service
 */
gameStatRouter.patch('/edit/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error: any) {
        next(error)
    }
})

/**
 * Fetches single Game Stat using Game Stat Service
 */
gameStatRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error: any) {
        next(error)
    }
})

/**
 * Put Player on cooldown
 */
export type CooldownPlayerProps = {
    id: number;
    playerId: number;
}
gameStatRouter.patch('/cooldown-player/:id', async (req: Request<CooldownPlayerProps>, res: Response, next: NextFunction) => {
    try {
        const gameStatId = req.params.id
        const { playerId } = req.body as CooldownPlayerProps
        const _gameStatUpdated = await gameStatsService.putPlayerOnCooldown(Number(gameStatId), Number(playerId))
        console.log({_gameStatUpdated});
        res.status(201).json({data: _gameStatUpdated, message: "Cooldown Triggered, wait 15 minutes"})
    } catch (error: any) {
        next(error)
    }
})

/**
 * Put Player on cooldown
 */
export type RefillPlayerLivesProps = {
    id: number;
    playerId: number;
}
gameStatRouter.patch('/refill-lives/:id', async (req: Request<RefillPlayerLivesProps>, res: Response, next: NextFunction) => {
    try {
        const gameStatId = Number(req.params.id)
        const {playerId} = req.body as RefillPlayerLivesProps
        const refilledLives = await gameStatsService.refillPlayerLives(gameStatId, Number(playerId))
        console.log({refilledLives});
        res.status(200).json({data: refilledLives, message: "Your lives are refilled"})
    } catch (error: any) {
        next(error)
    }
})

export type PopBalloonProps = {
    gameStatId: number;
    playerId: number;
}

/**
 * Popping balloon increments Player's cowries
 */
gameStatRouter.patch('/pop-balloon/:gameStatId', async (req: Request<PopBalloonProps>, res: Response, next: NextFunction) => {
    try {
        const gameStatId = req.params.gameStatId
        const { playerId } = req.body as PopBalloonProps
        const updatedPlayer = await gameStatsService.popBalloon(Number(gameStatId), Number(playerId))
        res.status(200).json({ data: updatedPlayer })
    } catch (error) {
        next(error)
    }
})

export type LoseLifeProps = {
    id: number;
    playerId: number
}
gameStatRouter.patch('/lose-life/:id', async (req: Request<LoseLifeProps>, res: Response, next: NextFunction) => {
    try {
        const gameStatId = Number(req.params.id)
        const {playerId} = req.body as LoseLifeProps
        const updatedLives = await gameStatsService.playerLoseLife(gameStatId, Number(playerId))
        console.log({updatedLives})
        res.status(200).json({data: updatedLives.data, message: updatedLives.message})
    } catch (error: any) {
        next(error)
    }
})
export default gameStatRouter