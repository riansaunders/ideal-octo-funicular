"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
var isDev = process.env.NODE_ENV !== "production";
if (isDev) {
    app.use("/", express_1.default.static("../../dist/web"));
}
else {
    app.use("/", express_1.default.static("../web"));
    console.log(path_1.default.join(__dirname, "web"));
}
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:".concat(port));
});
