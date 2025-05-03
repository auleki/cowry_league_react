import jwt from 'jsonwebtoken'
import {NextFunction, Response, Request} from "express";

type AuthenticationProps = {
    user: {}
}
const authenticateToken = async (req: Request<AuthenticationProps>, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) return res.status(401).json({error: 'Access denied. No token provided.'})
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded;
        // console.log({decoded})
        next()
    } catch (error: any) {
        res.status(400).json({error: 'Invalid Token'})        
    }
}

export default authenticateToken;