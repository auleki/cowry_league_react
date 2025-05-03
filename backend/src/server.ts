import * as dotenv from 'dotenv';
import express from 'express'
import { dbQueries } from '../db/connect.js';
import cors from 'cors'
import morgan from 'morgan'
// import { PrismaClient } from '@prisma/client';
import playerRouter from './player/player.route';
import potRouter from './pot/pot.route'
import gameRouter from './game/game.route'
import { errorHandler } from '../utils/errorHandler'
import gameStatRouter from './gameStats/gameStats.route';
import authRouter from "./auth/auth.route";
import cowryRouter from "./cowry/cowry.route"
import authenticateToken from "./middlewares/authenticateToken";
import fiatTxnsRouter from "./fiatTransactions/fiatTransactions.route";
import cowryTxnRouter from "./cowry/transactions/cowryTransactions.route";
import authenticateAdminToken from "./middlewares/authenticateAdmin";

dotenv.config()
export const app = express()

// Middleware to parse JSON request bodies
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/player', authenticateToken, playerRouter)
app.use('/pot', authenticateToken, potRouter)
app.use('/game', authenticateToken, gameRouter)
app.use('/game-stat', authenticateToken, gameStatRouter)
app.use('/fiat', fiatTxnsRouter)
app.use('/cowry-transactions', cowryTxnRouter)
app.use('/auth', authRouter)
// app.use('/cowry-verse', authenticateAdminToken, cowryRouter)
app.use('/cowry-verse', cowryRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Cowry League BE up @ ${PORT}`))

// Middleware to log incoming requests

// Middleware to validate the request body
