import { Request } from "express";

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