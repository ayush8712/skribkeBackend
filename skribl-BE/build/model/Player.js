"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapService_1 = require("../service/MapService");
const _base_1 = __importDefault(require("./_base"));
class Player extends _base_1.default {
    constructor(_socket, _name, _role, _avatar) {
        super(_socket.id);
        this._socket = _socket;
        this._name = _name;
        this._role = _role;
        this._avatar = _avatar;
        MapService_1.mapService.setEntity(this.id, this);
    }
    get mySocket() {
        return this._socket;
    }
    joinRoom(roomId) {
        this._roomId = roomId;
        this._socket.join(roomId);
    }
    leaveRoom() {
        this._socket.leave(this._roomId);
        this._roomId = undefined;
    }
    get name() {
        return this._name;
    }
    get avatar() {
        return this._avatar;
    }
    get roomId() {
        return this._roomId;
    }
    get role() {
        return this._role;
    }
    update(newRole) {
        this._role = newRole;
        MapService_1.mapService.setEntity(this.id, this);
    }
    toJson() {
        return {
            name: this._name,
            id: this.id,
            role: this._role,
            avatar: this._avatar,
        };
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map