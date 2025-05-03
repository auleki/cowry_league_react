import prisma from "../../db/connect";
import {LoginProps, RegisterProps, ResetPasswordProps} from "./auth.types";
import PlayerService from "../player/player.service";
import {
    generateEmailTemplate,
    generateVerifyUserEmailTemplate,
    sendEmail
} from "../../utils/services/email/email.service";
import {Player} from "@prisma/client";
import {createJwtToken, handleError, hashUserPassword, isPasswordCorrect, verifyJwtToken} from "../../utils/util";

const playerService = new PlayerService()
export default class AuthService {
    async login({email, password}: LoginProps) {
        try {
            console.log({email, password})
            if (!email || !password) throw Error('Email and password required')
            const user = await prisma.player.findFirstOrThrow({where: {email: email}})
            const isPassCorrect = await isPasswordCorrect(password, user.password)
            // console.log({user, isPassCorrect})
            if (!user) throw Error('No user found')

            if (!isPassCorrect) throw Error('Password incorrect')

            // if (!user.emailVerified) throw Error('Email is not verified, click the verify button')

            // const today = new Date()
            // const isTokenExpired = today < new Date(user.emailVerifiedTokenExpiresAt)
            // const expiredAt = new Date(user.emailVerifiedTokenExpiresAt)
            //
            // if (isTokenExpired) throw Error('Token has expired, resend a verification email.')

            // wrap up user info in token
            const newToken = await createJwtToken(
                {
                    id: user.id,
                    email: user.email,
                    isEmailVerified: user.emailVerified,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    cowryBalance: user.cowryBalance,
                    nairaBalance: user.nairaBalance,
                }
            )
            console.log({newToken})
            return newToken
        } catch (error: any) {
            console.log({error})
            return {error}
        }
    }

    async register(data: RegisterProps) {
        try {
            return await playerService.createPlayer(data)
        } catch (error: any) {
            console.log(error)
        }
    }

    async resetPassword({email}: ResetPasswordProps) {
        try {
            const player = await prisma.player.findFirstOrThrow({where: {email}})
            if (player) console.log("Password reset mail sent!")
            return player.email;
        } catch (error: any) {
            return {error}
        }
    }

    /*
     Method used when a player is created, an email is sent and when
      the user clicks on it, the email verified status changes to true
     */
    async verifyUserAccount(token: any) {
        try {
            // 
            console.log(token)
            // const _sentMail = await sendEmail('kodagiwa@gmail.com', generateVerifyUserEmailTemplate('James Harder'))
            // console.log({_sentMail})
        } catch (error: any) {
            console.log(error)
        }
    }

    async changePassword(newPassword: string, userId: number) {
        try {
            /**
             *
             */
            const updatedPassword = await prisma.player.findFirstOrThrow({where: {id: userId}})
            
            // console.log({updatedPassword})
        } catch (error: any) {
            console.log({error})
        }
    }

    async changeOldPassword(newPassword: string, oldPassword: string, userId: number) {
        try {
            /**
             * 1. find the user requesting a change
             * 2. check if the old password is correct
             * 0. check if the old password matches the new password
             * 3. Then hash this new one and save it as the current password
             */
            const user = await prisma.player.findFirstOrThrow({where: {id: userId}})
            if (!user) throw Error('No user found!')

            if (!await isPasswordCorrect(oldPassword, user.password)) throw Error('Password incorrect!')
            const hashedPass = await hashUserPassword(newPassword)
            // const updatedUser = await prisma.player.update(
            //     {
            //         where: {
            //             id: userId
            //         },
            //         data: {
            //             password: hashedPass
            //         }
            //     })
            console.log({hashedPass, newPassword})
            return "Password updated successfully!"
        } catch (error: any) {
            console.log(error)
            return error
        }
    }

    async activateUser() {
    }

    async deactivateUser() {
    }
}