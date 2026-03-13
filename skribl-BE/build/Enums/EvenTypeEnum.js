"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeEnum = void 0;
var EventTypeEnum;
(function (EventTypeEnum) {
    EventTypeEnum["ERROR"] = "/error";
    EventTypeEnum["CREATE_GAME"] = "/game/create";
    EventTypeEnum["JOIN_GAME"] = "/game/join";
    EventTypeEnum["DRAW"] = "/game/canvas/draw";
    EventTypeEnum["CHAT"] = "/game/chat/guess";
    EventTypeEnum["START_GAME"] = "/game/start";
    EventTypeEnum["ROUND_SYNC"] = "/game/round/sync";
    EventTypeEnum["WORD_REVEAL"] = "/game/word_reveal";
    EventTypeEnum["END_GAME"] = "/game/end";
    EventTypeEnum["ROOM_SYNC"] = "/game/room/sync";
    EventTypeEnum["DISCONNECT"] = "disconnect";
})(EventTypeEnum = exports.EventTypeEnum || (exports.EventTypeEnum = {}));
//# sourceMappingURL=EvenTypeEnum.js.map