"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameHelperService = void 0;
const EvenTypeEnum_1 = require("../Enums/EvenTypeEnum");
const UserRoleEnum_1 = require("../Enums/UserRoleEnum");
const MapService_1 = require("./MapService");
const WebSocketService_1 = require("./WebSocketService");
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
class GameHelperService {
    constructor() {
        this.wordlist = fs_1.default.readFileSync("src/utils/word.txt", "utf-8").split(",\n");
    }
    static getInstance() {
        if (!GameHelperService._instance) {
            GameHelperService._instance = new GameHelperService();
        }
        return GameHelperService._instance;
    }
    getPlayer(socket) {
        const player = MapService_1.mapService.getEntity(socket.id);
        if (!player) {
            console.log(`[Game Service] Player Does not exist.`);
            WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ERROR, "Player Does not exist.");
            return;
        }
        return player;
    }
    checkPlayer(socket, player, role) {
        if (player.role !== role) {
            console.log(`[Game Service] Unauthorized Access.`);
            WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ERROR, "Unauthorized Access.");
            return false;
        }
        return true;
    }
    checkPlayerRoom(socket, player) {
        const room = MapService_1.mapService.getEntity(player.roomId || "");
        if (!room) {
            console.log(`[Game Service] Invalid Room Id`);
            WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ERROR, "Invalid Room Id");
            return;
        }
        if (!room.players.includes(player.id)) {
            console.log(`[Game Service] Player Does not belongs to Room`);
            WebSocketService_1.webSocketService.sendPrivate(socket, EvenTypeEnum_1.EventTypeEnum.ERROR, "Player Does not belongs to Room");
            return;
        }
        return room;
    }
    getPlayerAndRoom(socket, roleCheck = true) {
        const player = this.getPlayer(socket);
        if (!player) {
            return {};
        }
        if (roleCheck && !this.checkPlayer(socket, player, UserRoleEnum_1.UserRoleEnum.CREATER)) {
            return {};
        }
        const room = this.checkPlayerRoom(socket, player);
        if (!player) {
            return { player };
        }
        return { player, room };
    }
    getRandomWords() {
        const index = (0, lodash_1.random)(0, this.wordlist.length - 1);
        return [
            this.wordlist[index],
            this.wordlist[(index + 1) % this.wordlist.length],
            this.wordlist[(index + 2) % this.wordlist.length],
        ];
    }
}
exports.gameHelperService = GameHelperService.getInstance();
//# sourceMappingURL=GameHelperService.js.map