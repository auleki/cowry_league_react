import {Router, Request, Response, NextFunction} from "express";
import CowryService from "./cowry.service";

const cowryRouter = Router()
const cowryService = new CowryService()
cowryRouter.post('/create-world', async (req: Request, res: Response, next: NextFunction) => {
    // create the cowry currency
    try {
        const cowryVerse = await cowryService.createGameCurrency()
        console.log({cowryVerse})
        res.status(201).json({data: cowryVerse})
    } catch (error: any) {
        next(error)
    }
})

cowryRouter.get('/get-currency', async (req: Request, res: Response, next: NextFunction) => {
    // create the cowry currency
    try {
        const cowry = await cowryService.getCowry()
        console.log({cowry})
        res.status(200).json({data: cowry})
    } catch (error: any) {
        next(error)
    }
})

cowryRouter.get('/total-supply', async (req: Request, res: Response, next: NextFunction) => {
    // create the cowry currency
    try {
        const cowry = await cowryService.getTotalSupply()
        console.log({cowry})
        res.status(201).json({data: cowry})
    } catch (error: any) {
        next(error)
    }
})

export default cowryRouter