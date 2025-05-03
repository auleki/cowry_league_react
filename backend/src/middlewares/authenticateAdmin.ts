import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

type AuthenticationProps = {
    admin: {}
}

const authenticateAdminToken = async (req: Request, res: Response, next: NextFunction)=> {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({error: 'Access denied. No admin token provided.'})

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded;
        
        console.log({adminDecoded: decoded})
        
        // console.log({decoded})
        next()
    } catch (error: any) {
        res.status(400).json({error: 'Invalid Admin Token'})
    }
    
}

export default authenticateAdminToken