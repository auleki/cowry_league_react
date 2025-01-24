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
    type: 'transfer' | 'ussd'
}

export type WithdrawParams = {
    amount: number;
    type: 'transfer' | 'ussd',
    bankAccountDetails?: string
}


export type DepositCowryParams = {
    amount: number
}
