import nodemailer from 'nodemailer'
import * as Brevo from '@getbrevo/brevo'
import axios from "axios";


export async function sendEmail(recipient: string, body: string) {
    try {
        console.log('Sending Email...')

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'kennykirk777@gmail.com',
                pass: 'googlePASSWORD00'
            }
        })

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient-email@example.com',
            subject: 'Hello from Node.js',
            text: 'This is a test email sent using Nodemailer',
            html: '<p>This is a test email sent using Nodemailer</p>',
        };

        
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
        console.log('Email sent:')
        return "Email Sent"
    } catch (error: any) {
        console.log(error)
    }
}

export function generateEmailTemplate(content: string) {
    return `This is the email content: ${content} surrounded by nothing but whitespace`
}

export function generateVerifyUserEmailTemplate(name: string) {
    return `Verification of user ${name} account:`
}