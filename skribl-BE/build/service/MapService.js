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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapService = void 0;
const _ = __importStar(require("lodash"));
// TODO: Move to Redis
class MapService {
    constructor() {
        this.map = {};
    }
    static getInstance() {
        if (!MapService._instance) {
            MapService._instance = new MapService();
        }
        return MapService._instance;
    }
    setEntity(id, obj) {
        this.map[id] = obj;
    }
    getEntity(id) {
        return this.map[id];
    }
    remove(id) {
        this.map = _.omit(this.map, id);
    }
    add(id, data) {
        this.map[id] = data;
    }
    get(id) {
        return this.map[id];
    }
}
exports.mapService = MapService.getInstance();
//# sourceMappingURL=MapService.js.map