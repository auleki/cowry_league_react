// Texts for various actions and outcomes

export const TransferNotif = {
    TopUpFail: "Your top up was not successful, give it another go",
    InsufficientFunds: "Your beneficiary account has insufficient funds"
}

export const CowryNotif = {
    InsufficientCowries: "Cowries not enough, you need more!"
}

export const AdminNotif = {
    OnlyAdmin: "Only an Admin can execute this action"
}

export const GameNotif = {
    GameNotFound: "Game not found"
}

export const PlayerNotif = {
    NotFound: "Sorry, we know no such player!",
    DepositInitiated: "Deposit initiated!",
    TransactionNotVerified: "Transaction not verified, please complete your payment",
    UpdateCowryBalance: "Cowries done land!",
    WithdrawnCowries: "Cowries have been withdrawn!",
    UpdatedFiatBalance: "Your deposit has arrived!",
    PlayerCreated: "New Player created!",
    AmountInvalid: "Deposit amount should be a number!",
    AmountWithdrawn: "Amount successfully withdrawn!",
    DepoitSuccessful: "Cowry Balance has been topped up!",
}

export const PotRouterMessages = {
    PotCreated: "New Pot created",
    PotUnavailable: "This Pot can't be used",
    EmptyPotList: "No Pots created yet",
    GetAllPots: 'All Pots found',
    DeleteAllPots: 'All Pots deleted',
    GetSinglePot: "Pot found",
    CantRejoin: "You were kicked out, only a moderator can add you to this Pot",
    PlayerJoinedPot: "New player joined Pot",
    PlayerExitPot: "A player left the Pot",
    PlayerRemoveFromPot: "A player has been removed from the Pot",
    PotNotFound: "Pot does not exist, try another universe",
    DeletePot: "Pot has been deleted",
    InvalidId: "Pot is invalid",
    TooLate: "Pot almost closed, join another pot with more than 10 minutes left on its countdown",
    Closed: "Pot closed, try another"
}

export const GameRouterMessages = {
    GameCreated: "New game crreated",
    GameNotFound: "Game not found",
    PlayerJoin: "A player has joined the game",
    PlayerOnCooldown: "Your game session is on cooldown, come back at the defined time.",
    Invalid: "Game invalid"
}

export const GameStatRouterMessages = {
    PlayerNotInGame: "Player is not part of game",
    CantStartGame: "Game can't be started",
    GameNotStart: "This game has not started",
    PlayerHasLives: "Error as Player still has lives",
    CantRefillLives: "Can't refill lives, you still got some",
    CooldownNotElapsed: "Cooldown has not elapsed"
}