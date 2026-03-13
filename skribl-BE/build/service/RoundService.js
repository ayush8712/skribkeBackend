"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundService = void 0;
const EvenTypeEnum_1 = require("../Enums/EvenTypeEnum");
const GameStateEnum_1 = require("../Enums/GameStateEnum");
const GameHelperService_1 = require("./GameHelperService");
const MapService_1 = require("./MapService");
const WebSocketService_1 = require("./WebSocketService");
class RoundService {
    constructor() { }
    static getInstance() {
        if (!RoundService._instance) {
            RoundService._instance = new RoundService();
        }
        return RoundService._instance;
    }
    wordReveal(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket, false);
            if (!player || !room) {
                return;
            }
            WebSocketService_1.webSocketService.sendToRoom(socket, EvenTypeEnum_1.EventTypeEnum.WORD_REVEAL, room.id, {
                word: room.currentWord,
            });
            WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
                round_start: false,
            });
            setTimeout(this.roundSync, 5000, socket);
        });
    }
    gameChat(socket, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket, false);
            if (!player || !room) {
                return;
            }
            const drawerId = room.players[room.currentPlayerIndex];
            if (drawerId === player.id) {
                return;
            }
            if (room.checkGuessWord(message.trim() || "")) {
                if (room.isAlreadyGuessed(player.id)) {
                    return;
                }
                const curScore = room.scores[player.id];
                const timeLeft = room.roomSetting.round_time - room.timeElapsed;
                if (timeLeft > 0) {
                    room.changeScore(player.id, curScore + timeLeft * 5);
                    room.changeScore(drawerId, room.scores[drawerId] + timeLeft * 2);
                    room.markPlayerGuessed(player.id);
                    WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
                        scores: room.scores,
                        guessed_player_id: player.id,
                        time_left: timeLeft - 1,
                    });
                }
                if (room.getGuessPlayerCount() + 1 === room.players.length) {
                    WebSocketService_1.webSocketService.sendToRoom(socket, EvenTypeEnum_1.EventTypeEnum.WORD_REVEAL, room.id, {
                        word: room.currentWord,
                    });
                    WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
                        round_start: false,
                    });
                    setTimeout(this.roundSync, 5000, socket);
                }
            }
            else {
                WebSocketService_1.webSocketService.sendToRoom(socket, EvenTypeEnum_1.EventTypeEnum.CHAT, room.id, {
                    message: message,
                    id: player.id,
                });
            }
        });
    }
    roundSync(socket, chosenWord) {
        return __awaiter(this, void 0, void 0, function* () {
            const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket, false);
            if (!player || !room) {
                return;
            }
            if (chosenWord && chosenWord.trim() !== "") {
                room.setCurrenWord(chosenWord);
                room.resetRound();
                WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
                    choosing: false,
                    round_start: true,
                    word_length: chosenWord.length,
                });
            }
            else {
                if (room.isFinalOver()) {
                    WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.END_GAME, room.id, {
                        game_state: GameStateEnum_1.GameStateEnum.END,
                        scores: room.scores,
                    });
                }
                else if (room.roomSetting.round_time - room.timeElapsed <= 0 ||
                    room.getGuessPlayerCount() + 1 === room.players.length) {
                    if (room.chanceCount === room.players.length) {
                        room.updateCurrentRound(room.currentRound + 1);
                        room.setChanceCount(1);
                    }
                    else {
                        room.setChanceCount(room.chanceCount + 1);
                    }
                    room.updateToNextPlayer();
                    room.setCurrenWord("");
                    room.resetRound();
                    const nextPlayerId = room.players[room.currentPlayerIndex];
                    WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
                        scores: room.scores,
                        turn_player_id: nextPlayerId,
                        round: room.currentRound,
                        choosing: true,
                        round_change: true,
                    });
                    WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.DRAW, room.id, {
                        commands: [[2]],
                    });
                    const nextPlayer = MapService_1.mapService.getEntity(nextPlayerId);
                    if (!nextPlayer) {
                        console.log("[Game Service] Something went wrong, next Player does not exist.");
                        WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ERROR, room.id, "Server Error");
                    }
                    else {
                        WebSocketService_1.webSocketService.sendPrivate(nextPlayer.mySocket, EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, {
                            word_list: GameHelperService_1.gameHelperService.getRandomWords(),
                        });
                    }
                }
            }
        });
    }
}
exports.roundService = RoundService.getInstance();
//# sourceMappingURL=RoundService.js.map