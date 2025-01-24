import * as dotenv from 'dotenv';
import express from 'express'
import { dbQueries } from '../db/connect.js';
import cors from 'cors'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client';
import playerRouter from './player/player.route';
import potRouter from './pot/pot.route'
import { errorHandler } from '../utils/errorHandler'

const prisma = new PrismaClient();
dotenv.config()
export const app = express()

// Middleware to parse JSON request bodies
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/player', playerRouter)
app.use('/pot', potRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Cowry League BE up @ ${PORT}`))

// Middleware to log incoming requests

// Middleware to validate the request body
