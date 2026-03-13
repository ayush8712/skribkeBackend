"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketService = void 0;
const socket_io_1 = require("socket.io");
const GameHandler_1 = __importDefault(require("../handlers/GameHandler"));
class WebSocketService {
    constructor() {
        this.io = null;
    }
    static getInstance() {
        if (!WebSocketService._instance) {
            WebSocketService._instance = new WebSocketService();
        }
        return WebSocketService._instance;
    }
    init(server) {
        this.io = new socket_io_1.Server(server, {
            transports: ["websocket"],
            cors: {
                origin: ["http://localhost:3000", "https://skribble-app.netlify.app/"],
            },
        });
        this.io.on("connection", (socket) => {
            console.log(`[WebSocketService] User Connected : ${socket.id}`);
            GameHandler_1.default.gameCreateHandler(socket);
            GameHandler_1.default.gameJoinHandler(socket);
            GameHandler_1.default.gameRoomSyncHandler(socket);
            GameHandler_1.default.drawHandler(socket);
            GameHandler_1.default.gameLeaveHandler(socket);
            GameHandler_1.default.gameChatHandler(socket);
            GameHandler_1.default.gameRoundSyncHandler(socket);
            GameHandler_1.default.gameStartHandler(socket);
            GameHandler_1.default.gameWordRevealHandler(socket);
        });
    }
    sendPrivate(socket, event, message) {
        var _a;
        (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(socket.id).emit(event, message);
    }
    sendToRoom(socket, event, roomId, message) {
        socket.to(roomId).emit(event, message);
    }
    sendToAll(socket, event, message) {
        socket.broadcast.emit(event, message);
    }
    sendToRoomByIO(event, roomId, message) {
        var _a;
        (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(roomId).emit(event, message);
    }
}
exports.webSocketService = WebSocketService.getInstance();
//# sourceMappingURL=WebSocketService.js.map