"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocketService_1 = require("./service/WebSocketService");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const boot = (port) => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: ["http://localhost:3000", "https://skribble-app.netlify.app/"],
    }));
    app.get("/", (req, res) => {
        return res.send("Server is up");
    });
    app.all("*", (req, res) => {
        res.status(404).send("404! Page not found");
    });
    const httpServer = (0, http_1.createServer)(app);
    WebSocketService_1.webSocketService.init(httpServer);
    httpServer.listen(port, () => {
        console.log(`Server Listening on Port ${port}`);
    });
};
boot(process.env.PORT ? +process.env.PORT : 4000);
//# sourceMappingURL=server.js.map