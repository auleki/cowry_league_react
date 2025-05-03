import {TRANSACTION_TYPE} from "../../utils/enum";

export interface IPlayer {
    firstname: string,
    lastname: string,
    cowryBalance: number,
    nairaBalance: number,
    email: string,
    dateJoined: Date,
    currentPot: [] | null,
    potsJoined: [] ,
}

export interface IBankAccountDetails {
    accountNumber: number;
    accountBankCode: number
}

export type DepositParams = {
    amount: number;
    type: TRANSACTION_TYPE
}

export type VerifyDepositParams = {
    transactionReference: string | number
}

export type WithdrawParams = {
    amount: number;
    type: 'transfer' | 'ussd',
    bankAccountDetails?: string
}


export type DepositCowryParams = {
    amount: number
}
