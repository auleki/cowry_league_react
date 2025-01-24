import { PrismaClient } from "@prisma/client";
import PlayerService from "./player.service";
import { IPlayer } from "./player.types";

const prisma = new PrismaClient()

const playerService = new PlayerService()

class PlayerController {
    // constructor() {
    //     this.getAllPlayers = this.getAllPlayers.bind(this)
    // }
    
    async getAllPlayers () {
        return await playerService.getAllPlayerStats()
    }
    async createPlayer(playerData: IPlayer) {
        playerService.createPlayer(playerData)
    }

    async editPlayer() {}

    async deletePlayer() {}

    async getPlayerStats() {}

    async seedPlayer () {}

}

export default PlayerController;