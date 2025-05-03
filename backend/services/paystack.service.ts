import https from 'https'
import {payGatewayAx} from "../instances/payGateway";
import {PAYMENT_VERIFICATION_STATUS} from "../utils/enum";

export default class PaystackService {
    async initiateTransaction(email: string, amount: number) {

        // try {
        return new Promise((resolve, reject) => {


            const params = JSON.stringify({
                "email": email,
                "amount": String(amount) + "00"
            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transaction/initialize',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + process.env.PAY_GATEWAY_API_KEY,
                    'Content-Type': 'application/json'
                }
            }

            let data = ''
            const req = https.request(options, res => {
                res.on('data', (chunk) => {
                    data += chunk
                    try {
                        const parsedData = JSON.parse(data)
                        resolve(parsedData)
                    } catch (e) {
                        reject(e)
                    }
                })
            });
            
            req.on('error', error => {
                console.error(error)
            })

            req.write(params)
            req.end()
        })
    }

    async verifyTransaction(referenceId:string) {
        try {
            const {data} = await payGatewayAx.get(`/transaction/verify/${referenceId}`)
            return data.data.status === PAYMENT_VERIFICATION_STATUS.SUCCESS;             
        }
        catch (e: any) {
            throw Error(e)
        }
    }
}