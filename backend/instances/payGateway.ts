import axios from 'axios'

const API_KEY = process.env.PAY_GATEWAY_API_KEY

export const payGatewayAx = axios.create({
    baseURL: process.env.PAY_GATEWAY_BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
    },
    proxy: {
        host: 'api.paystack.co',
        port: 443
    }
})

const requestInterceptor = payGatewayAx.interceptors.request.use(config  => {
    // console.log({config})
    return config
})
const responseInterceptor = payGatewayAx.interceptors.response.use(config  => {
    // console.log({config})
    return config
})
