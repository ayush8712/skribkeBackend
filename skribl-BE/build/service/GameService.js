"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameService = void 0;
const EvenTypeEnum_1 = require("../Enums/EvenTypeEnum");
const GameStateEnum_1 = require("../Enums/GameStateEnum");
const UserRoleEnum_1 = require("../Enums/UserRoleEnum");
const Room_1 = __importDefault(require("../model/Room"));
const Helper_1 = require("../utils/Helper");
const GameHelperService_1 = require("./GameHelperService");
const MapService_1 = require("./MapService");
const WebSocketService_1 = require("./WebSocketService");
class GameService {
    constructor() { }
    static getInstance() {
        if (!GameService._instance) {
            GameService._instance = new GameService();
        }
        return GameService._instance;
    }
    createGame(socket, payload) {
        const uniqRoomId = Helper_1.Helper.generateRandomString(8, {
            includeLowerCase: true,
            includeUpperCase: true,
            includeNumbers: false,
        });
        const room = new Room_1.default(uniqRoomId, {
            total_rounds: 4,
            round_time: 60,
        });
        const player = room.addPlayer(socket, {
            id: socket.id,
            name: payload.name,
            role: UserRoleEnum_1.UserRoleEnum.CREATER,
            avatar: payload.avatar,
        });
        WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, {
            player: player.toJson(),
            room_id: player.roomId,
            game_state: GameStateEnum_1.GameStateEnum.LOBBY,
            player_status: 0,
            me: player.id,
        });
    }
    joinGame(socket, payload, roomId) {
        const room = MapService_1.mapService.get(roomId);
        if (!room) {
            console.log(`[Game Service] Invalid Room Id`);
            WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ERROR, "Invalid Room Id");
            return;
        }
        if (room.gameStarted) {
            return;
        }
        const player = room.addPlayer(socket, {
            id: socket.id,
            name: payload.name,
            role: UserRoleEnum_1.UserRoleEnum.JOINER,
            avatar: payload.avatar,
        });
        const playerIds = room.players;
        const players = playerIds.map((id) => {
            const player = MapService_1.mapService.getEntity(id);
            return player === null || player === void 0 ? void 0 : player.toJson();
        });
        WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, {
            room_id: player.roomId,
            game_state: GameStateEnum_1.GameStateEnum.LOBBY,
            settings: room.roomSetting,
            me: player.id,
            player_status: 0,
            players,
        });
        WebSocketService_1.webSocketService.sendToRoom(socket, EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, room.id, {
            player: player.toJson(),
            settings: room.roomSetting,
            player_status: 0,
        });
    }
    changeGameSettings(socket, setting) {
        const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket);
        if (!player || !room) {
            return;
        }
        room.updateSetting(setting);
        WebSocketService_1.webSocketService.sendToRoom(socket, EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, room.id, {
            settings: room.roomSetting,
        });
    }
    draw(socket, commands) {
        const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket, false);
        if (!player || !room) {
            return;
        }
        if (room.players[room.currentPlayerIndex] === player.id) {
            WebSocketService_1.webSocketService.sendToRoom(socket, EvenTypeEnum_1.EventTypeEnum.DRAW, room.id, commands);
        }
    }
    leaveGame(socket) {
        const player = MapService_1.mapService.getEntity(socket.id);
        if (!player) {
            return;
        }
        if (!player.roomId) {
            return;
        }
        const room = MapService_1.mapService.getEntity(player.roomId);
        if (!room) {
            return;
        }
        MapService_1.mapService.remove(player.id);
        player.leaveRoom();
        if (room.players.length < 3) {
            MapService_1.mapService.remove(room.id);
            WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ERROR, room.id, {});
        }
        else {
            if (room.players[room.currentPlayerIndex] === player.id) {
                room.updateToNextPlayer();
                room.setCurrenWord("");
                room.resetRound();
                const nextPlayerId = room.players[room.currentPlayerIndex];
                WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
                    scores: room.scores,
                    turn_player_id: nextPlayerId,
                    round: room.currentRound,
                    choosing: true,
                    round_start: false,
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
            if (player.role === UserRoleEnum_1.UserRoleEnum.CREATER) {
                const nextPlayer = MapService_1.mapService.getEntity(room.players[0]);
                nextPlayer === null || nextPlayer === void 0 ? void 0 : nextPlayer.update(UserRoleEnum_1.UserRoleEnum.CREATER);
                WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, room.id, {
                    player_status: 2,
                    player: nextPlayer === null || nextPlayer === void 0 ? void 0 : nextPlayer.toJson(),
                });
            }
            WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, room.id, {
                player_status: 1,
                player: player.toJson(),
            });
        }
        room.removePlayer(player.id);
    }
    startGame(socket) {
        const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket);
        if (!player || !room) {
            return;
        }
        const playerIds = room.players;
        if (playerIds.length < 2) {
            return;
        }
        const drawer = MapService_1.mapService.getEntity(Helper_1.Helper.getRandom(playerIds));
        if (!drawer) {
            return;
        }
        room.setCurrentPlayerIndex(room.players.indexOf(drawer.id));
        room.resetScore();
        room.setGameStarted(true);
        WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, room.id, {
            game_state: GameStateEnum_1.GameStateEnum.START,
            scores: room.scores,
            turn_player_id: drawer.id,
            round: room.currentRound,
            choosing: true,
            time_left: room.roomSetting.round_time,
        });
        WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.DRAW, room.id, {
            commands: [[2]],
        });
        WebSocketService_1.webSocketService.sendPrivate(drawer.mySocket, EvenTypeEnum_1.EventTypeEnum.ROUND_SYNC, {
            word_list: GameHelperService_1.gameHelperService.getRandomWords(),
        });
    }
    reGame(socket) {
        const { player, room } = GameHelperService_1.gameHelperService.getPlayerAndRoom(socket);
        if (!player || !room) {
            return;
        }
        room.setGameStarted(false);
        room.resetScore();
        room.setCurrenWord("");
        room.resetRound();
        room.setCurrentPlayerIndex(-1);
        room.updateCurrentRound(1);
        WebSocketService_1.webSocketService.sendToRoomByIO(EvenTypeEnum_1.EventTypeEnum.ROOM_SYNC, room.id, {
            game_state: GameStateEnum_1.GameStateEnum.LOBBY,
        });
    }
}
exports.gameService = GameService.getInstance();
//# sourceMappingURL=GameService.js.map