"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pitchController_1 = require("../controllers/pitchController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/copy-template/:id', authMiddleware_1.default, pitchController_1.copyTemplate);
router.post('/create', authMiddleware_1.default, pitchController_1.createPitch);
router.get('/get-all', pitchController_1.getAllPitches);
router.get('/:id', pitchController_1.getPitch);
exports.default = router;
