"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const MapService_1 = require("../service/MapService");
const Player_1 = __importDefault(require("./Player"));
const _base_1 = __importDefault(require("./_base"));
class Room extends _base_1.default {
    constructor(id, _roomSetting) {
        super(id);
        this._roomSetting = _roomSetting;
        this._players = [];
        this._curentRound = 1;
        this._roundStartTime = moment_1.default.now();
        this._scores = {};
        this._currentWord = "";
        this._currentPlayerIndex = 0;
        this._guessedPlayer = [];
        this._gameStarted = false;
        this._chanceCount = 1;
        this._updateCache();
    }
    _updateCache() {
        MapService_1.mapService.setEntity(this.id, this);
    }
    get chanceCount() {
        return this._chanceCount;
    }
    setChanceCount(count) {
        this._chanceCount = count;
    }
    resetScore() {
        for (const playerId of this.players) {
            this._scores[playerId] = 0;
        }
        this._updateCache();
    }
    getGuessPlayerCount() {
        return this._guessedPlayer.length;
    }
    updateCurrentRound(round) {
        this._curentRound = round;
        this._updateCache();
    }
    isFinalOver() {
        return this._curentRound >= this._roomSetting.total_rounds;
    }
    get timeElapsed() {
        return Math.floor((moment_1.default.now() - this._roundStartTime) / 1000);
    }
    isAlreadyGuessed(playerId) {
        return this._guessedPlayer.includes(playerId);
    }
    markPlayerGuessed(playerId) {
        this._guessedPlayer.push(playerId);
        MapService_1.mapService.setEntity(this.id, this);
    }
    updateToNextPlayer() {
        this._currentPlayerIndex++;
        this._currentPlayerIndex = this._currentPlayerIndex % this._players.length;
        this._updateCache();
    }
    get currentRound() {
        return this._curentRound;
    }
    setCurrentPlayerIndex(idx) {
        this._currentPlayerIndex = idx;
        this._updateCache();
    }
    get scores() {
        return this._scores;
    }
    addPlayer(socket, playerPayload) {
        const player = new Player_1.default(socket, playerPayload.name, playerPayload.role, playerPayload.avatar);
        player.joinRoom(this.id);
        this._players.push(player.id);
        this._updateCache();
        return player;
    }
    get roomSetting() {
        return this._roomSetting;
    }
    updateSetting(setting) {
        this._roomSetting = setting;
        this._updateCache();
    }
    get players() {
        return this._players;
    }
    checkGuessWord(word) {
        return this._currentWord === word;
    }
    setCurrenWord(word) {
        this._currentWord = word;
        this._updateCache();
    }
    get currentPlayerIndex() {
        return this._currentPlayerIndex;
    }
    get currentWord() {
        return this._currentWord;
    }
    changeScore(playerId, score) {
        this._scores[playerId] = score;
        this._updateCache();
    }
    removePlayer(playerId) {
        if (playerId.length === 0) {
            console.log("[Room] Empty Room");
            return;
        }
        const pos = this.players.indexOf(playerId);
        if (pos < 0 || pos >= this._players.length) {
            console.log("[Room] Player Does not exist");
            return;
        }
        this._scores = _.omit(this._scores, this._players[pos]);
        this._players[pos] = this._players[this._players.length - 1];
        this._players.pop();
        this._updateCache();
    }
    resetRound() {
        this._roundStartTime = moment_1.default.now();
        this._guessedPlayer = [];
        this._updateCache();
    }
    setGameStarted(start) {
        this._gameStarted = start;
        this._updateCache();
    }
    get gameStarted() {
        return this._gameStarted;
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map