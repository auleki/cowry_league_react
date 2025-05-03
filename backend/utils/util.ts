import {Request, Response} from "express";
import {sha256} from 'crypto-hash'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {SALT_ROUNDS} from "./constants";

export function extractQueryField(req: Request, field: string) {
    return req.query[field] ?? null
}

export function extractParamsField(req: Request<any>, field: string) {
    return req.params[field] ?? null
}

export function isGameOnCooldown(lastCooldown: Date) {
    const today = new Date()
    const cooldownEndTime = new Date(lastCooldown.getTime() + 15 * 60 * 1000)
    const isCoolingDown = today < cooldownEndTime
    const remainingMs = cooldownEndTime.getTime() - today.getTime()
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60))
    // console.log(`Cooldown status ${isCoolingDown ? 'Active' : 'Expired'} | Remaining minutes: ${remainingMinutes}mins`)
    return {
        isCoolingDown,
        remainingMinutes
    }
}

export async function doesResourceExist(condition: any, errorMessage: string) {
    if (!condition)
        throw Error(errorMessage)
}

export async function generateUserVerificationToken(type: string, name = 'John Doe') {
    return crypto.randomBytes(32).toString('hex')
}

export async function hashUserPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return await bcrypt.hash(password, salt)
}

export async function isPasswordCorrect(password: string, savedPassword: string) {
    return await bcrypt.compare(password, savedPassword)
}

export async function createJwtToken(data: any) {
    // const oneHour = Math.floor(Date.now() / 1000) + (60 * 60)
    return jwt.sign({
        data,
    }, process.env.JWT_SECRET_KEY, {expiresIn: '1hr'} )
}

export async function verifyJwtToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

export function handleError(res: Response, errorCode: number, error: string) {
    res.status(errorCode).json({error})
}

export function handleResponse(res: Response, statusCode: number, message: string, data: any) {
    res.status(statusCode).json({data, message})
}

export function convertCowryToNairaForWithdrawal(cowryAmount: number = 10000, exchangeRate = 10, withdrawRate: float = 0.88): float {
    return (cowryAmount / exchangeRate) * withdrawRate
    
}

export function convertNairaToCowryOnDeposit(nairaAmount: float = 100, nairaRate: float = 10) {
    // think of the Obasanjo concept - 
    // const rateInNaira = nairaRate - 0.8
    return nairaAmount * nairaRate; 
}

//
// type HandleResponseProps = {
//     res: Response;
//     statusCode: number;
//     message: number;
//     data: any;
// }
// export async function handleResponse({res: Response, statusCode: number, message: string, data}: any){
//     // res.status(statusCode).json({data, message})
//     res.status(statusCode).json({data, message})
// }