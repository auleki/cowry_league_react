import { Request } from "express";

export function extractQueryField(req: Request, field: string) {
    return req.query[field] ?? null
}

export function extractParamsField(req: Request<any>, field: string) {
    return req.params[field] ?? null
}