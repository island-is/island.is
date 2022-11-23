"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutMiddleware = void 0;
const timeout_1 = __importDefault(require("./timeout"));
/**
 * Express.js middleware that timeouts after a lapse of time and triggers a function.
 * @param f the timeout function
 * @param delay the timeout delay
 * @returns the timeout middleware with capability to stop the internal timeout
 */
function timeoutMiddleware(f, delay) {
    const timeout = new timeout_1.default(f, delay);
    timeout.start();
    return {
        middleware(_request, response, next) {
            timeout.stop();
            response.on('finish', function () {
                timeout.start();
            });
            next();
        },
        stop() {
            timeout.stop();
        },
    };
}
exports.timeoutMiddleware = timeoutMiddleware;
//# sourceMappingURL=middleware.js.map