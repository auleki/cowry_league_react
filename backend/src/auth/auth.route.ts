import {NextFunction, Request, Response, Router} from 'express'
import AuthService from "./auth.service";
import {ChangeOldPasswordProps, ChangePasswordProps, LoginProps, RegisterProps, ResetPasswordProps} from "./auth.types";
import {handleError, handleResponse} from "../../utils/util";

const authService = new AuthService()
const authRouter = Router()


authRouter
    .post('/register', async (req: Request<RegisterProps>, res: Response, next: NextFunction) => {
        try {
            const data = req.body as RegisterProps
            const newUser = await authService.register(data)
            res.json({message: '[Auth] Register page', data: newUser})
        } catch (error: any) {
            console.log(error)
            res.json({error})
        }

    }).post('/login', async (req: Request<LoginProps>, res: Response, next: NextFunction) => {
    try {
        const data = req.body as LoginProps
        const userToken = await authService.login({email: data.email, password: data.password})

        if (userToken.error) {
            return res.status(400).json({error: userToken.error ?? "Error logging in"})
        }

        res.status(200).json({message: 'Login successful', data: userToken})
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error})
    }

}).patch('/verify', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.query.token
        if (!token) throw Error('No token supplied')

        const accountStatus = await authService.verifyUserAccount(token)
        res.status(200).json({data: '[Auth] Verify Token'})
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error})
    }

}).patch('/change-old-password', async (req: Request<ChangeOldPasswordProps>, res: Response, next: NextFunction) => {
    try {
        const {oldPassword, newPassword} = req.body as ChangeOldPasswordProps
        // const updatedPassword = await 
        res.json('Change old password')
    } catch (error: any) {
        console.log({error})
    }
    
}).patch('/change-password', async (req: Request<ChangePasswordProps>, res: Response, next: NextFunction) => {
    try {
        const {} = req.body as ChangePasswordProps
        const updatedPassword = await authService.changePassword()
        res.json({data: '[Auth] Change Password'})
    } catch (error: any) {
        console.log(error)
        res.json({error})
    }

}).patch('/deactivate-user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({data: '[Auth] Deactivate User'})
    } catch (error: any) {
        console.log(error)
        res.json({error})
    }

}).patch('/activate-user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({data: '[Auth] Activate User'})
    } catch (error: any) {
        console.log(error)
        res.json({error})
    }
}).patch('/reset-password', async (req: Request<ResetPasswordProps>, res: Response, next: NextFunction) => {
    try {
        const playerEmail = req.body as ResetPasswordProps
        const resetPlayerPassword = await authService.resetPassword(playerEmail)
        handleResponse(res, 200, 'Password reset successful', resetPlayerPassword)
    } catch (error: any) {
        handleError(res, 400, error)
    }
})

export default authRouter