import { NextFunction, Request, Response, Router } from "express";
import GameService from "./game.service";
import { extractParamsField } from "../../utils/util";

const gameRouter = Router()
const gameService = new GameService()


/**
 * Fetch all Games using the GameService
 */
gameRouter.get('/all', async (_: Request, res: Response, next: NextFunction) => {
    try {
        const _allGames = await gameService.getGames()
        res.json({ allGames: _allGames })
    } catch (error) {
        next(error)
    }
})

/**
 * Fetch single Game using the GameService
 */
gameRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = extractParamsField(req, "id")
        const _allGames = await gameService.getSingleGame(Number(gameId))
        res.json({ data: _allGames })
    } catch (error) {
        next(error)
    }
})
/**
 * Create a new Game using service
 */
export type NewGameProps = {
    potId: number
}
gameRouter.post('/new', async (req: Request<NewGameProps>, res: Response, next: NextFunction) => {
    try {
        // create a new game
        const {potId} = req.body as NewGameProps
        const newGame = await gameService.createGame(potId)
        console.log({newGame});
        res.status(201).json({data: newGame})
    } catch (error) {
        next(error)
    }
})

export type JoinGameProps = {
    playerId: number;
    gameId: number
}
gameRouter.patch('/join/:gameId', async (req: Request<JoinGameProps>, res: Response, next: NextFunction) => {
    try {
        const {playerId} = req.body as JoinGameProps
        const {gameId} = req.params as JoinGameProps;
        console.log({gameId, playerId});
        const _updatedGame = await gameService.playerJoinPotGame(Number(playerId), Number(gameId))
        res.status(201).json({ data: _updatedGame })
    } catch (error) {
        next(error)
    }
})

/**
 * Handle Player losing life within game using service
 */
type LoseLifeProps = {
    playerId: number;
    gameStatId: number;
}
gameRouter.patch('/lose-life', async (req: Request<LoseLifeProps>, res: Response, next: NextFunction) => {
    try {
        // remove life from player 
        const {gameStatId, playerId} = req.body as LoseLifeProps
        const _statId = await gameService.playerLoseLife(gameStatId, playerId)
        res.status(200).json({data: _statId, message: "Life lost"})
    } catch (error) {
        next(error)
    }
})

export type CreatedByProps = {
    playerId: number;
}

/** Show games a player created, user can filter for active games */
gameRouter.get('/created-by/:playerId', async (req: Request<CreatedByProps>, res: Response, next: NextFunction) => {
    try {
        const _player = req.params as CreatedByProps
        const gamesByPlayer = await gameService.gamesCreatedByPlayer(Number(_player.playerId))
        res.status(200).json({ gamesByPlayer, message: "Found the games you started" })
    } catch (error) {
        next(error)
    }
})

/**
 * Puts the game on hold, not allowing new players to join or ending game
 */
gameRouter.patch('/hold-game', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // pause game, preventing new players from joining
        // or players continuing the game
    } catch (error) {
        // handle error 
    }
})



/**
 * Suspend Game, meaning players can't join, leave or continue their game sessions
 */
gameRouter.patch('/suspend-game', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // suspend game
    } catch (error) {
        // handle error
    }
})

/**
 * Put Player on cooldown. Preventing player from creating new game sessions
 */
gameRouter.patch('/cooldown-player', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // put player on cooldown. so they can't start new game sessions
    } catch (error) {
        // handle error 
    }
})

/**
 * Delete a created game
 */
type GameRouterProps = {
    id: number
}
gameRouter.delete('/:id', async (req: Request<GameRouterProps>, res: Response, next: NextFunction) => {
    try {
        // put player on cooldown. so they can't start new game sessions
        const id = req.params.id
        const deletedGame = await gameService.deleteGame(Number(id))
        console.log({deletedGame});
        
        res.status(200).json({deletedGame, message: `Game deleted`})
    } catch (error) {
        next(error)
    }
})

export default gameRouter