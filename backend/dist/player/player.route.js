"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import PlayerController from "./player.controller.js";
// import PlayerService from "./player.service.js";
const playerRouter = (0, express_1.Router)();
// const playerService = new PlayerService()
playerRouter.get('/', (req, res) => {
    try {
        res.json({ data: 'Data Here!' });
    }
    catch (error) {
        res.json(error);
    }
});
exports.default = playerRouter;
