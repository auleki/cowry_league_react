export enum PLAYER_CHANGE_TYPE {
    "TOP_UP" = 'top-up',
    "WITHDRAWAL" = 'withdrawal',
    "COWRY_EARN" = 'cowry-earn',
    "COWRY_LOSS" = 'cowry-loss',
}

export enum POT_CHANGE_TYPE {
    "PLAYER_JOIN" = 'player-join',
    "PLAYER_EXIT" = "player-exit",
    "PLAYER_REMOVE" = "player-remove",
    "POT_CLOSE" = "pot-close",
    "POT_OPEN" = "pot-open",
}

export enum TRANSACTION_TYPE {
    "DEPOSIT" = "deposit",
    "WIN" = "win",
    "SPEND" = "spend",
    "CASHOUT" = "cashout",
}

export enum TRANSACTION_STATUS {
    "PENDING" = "pending",
    "SUCCESSFUL" = "successful",
    "FAILED" = "failed"
}

export enum PAYMENT_VERIFICATION_STATUS {
    "ABANDONED" ="abandoned",
    "SUCCESS" = "success"
}