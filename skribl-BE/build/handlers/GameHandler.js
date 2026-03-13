"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvenTypeEnum_1 = require("../Enums/EvenTypeEnum");
const GameService_1 = require("../service/GameService");
const RoundService_1 = require("../service/RoundService");
const gameCreateHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.CREATE_GAME, ({ player }) => {
        GameService_1.gameService.createGame(socket, player);
    });
};
const gameJoinHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.JOIN_GAME, ({ player, roomId }) => {
        GameService_1.gameService.joinGame(socket, player, roomId);
    });
};
const gameRoomSyncHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, (data) => {
        if (data.settings) {
            GameService_1.gameService.changeGameSettings(socket, data.settings);
        }
        if (data.new_game) {
            GameService_1.gameService.reGame(socket);
        }
    });
};
const drawHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.DRAW, (commands) => {
        GameService_1.gameService.draw(socket, commands);
    });
};
const gameLeaveHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.DISCONNECT, () => {
        GameService_1.gameService.leaveGame(socket);
        console.log(`[Handler] User Disconnected : ${socket.id}`);
    });
};
const gameChatHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.CHAT, (data) => {
        RoundService_1.roundService.gameChat(socket, data.message);
    });
};
const gameRoundSyncHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, (data) => {
        RoundService_1.roundService.roundSync(socket, data.chosen_word);
    });
};
const gameStartHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.START_GAME, () => {
        GameService_1.gameService.startGame(socket);
    });
};
const gameWordRevealHandler = (socket) => {
    socket.on(EvenTypeEnum_1.EventTypeEnum.WORD_REVEAL, () => {
        RoundService_1.roundService.wordReveal(socket);
    });
};
exports.default = {
    gameCreateHandler,
    gameJoinHandler,
    gameRoomSyncHandler,
    drawHandler,
    gameLeaveHandler,
    gameChatHandler,
    gameRoundSyncHandler,
    gameStartHandler,
    gameWordRevealHandler,
};
//# sourceMappingURL=GameHandler.js.map