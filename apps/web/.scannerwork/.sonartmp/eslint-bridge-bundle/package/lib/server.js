"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
/**
 * `module-alias` must be imported first for module aliasing to work.
 */
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const routing_1 = __importDefault(require("routing"));
const errors_1 = require("routing/errors");
const helpers_1 = require("helpers");
const timeout_1 = require("routing/timeout");
/**
 * The maximum request body size
 */
const MAX_REQUEST_SIZE = '50mb';
/**
 * The default timeout to shut down server if no request is received
 *
 * Normally, the Java plugin sends keepalive requests to the eslint-bridge
 * If the Java plugin crashes, this timeout will run out and shut down
 * the eslint-bridge to prevent it from becoming an orphan process.
 */
const SHUTDOWN_TIMEOUT = 15000;
/**
 * Starts the bridge
 *
 * The bridge is an Express.js web server that exposes several services
 * through a REST API. Once started, the bridge first begins by loading
 * any provided rule bundles and then waits for incoming requests.
 *
 * Communication between two ends is entirely done with the JSON format.
 *
 * Although a web server, the bridge is not exposed to the outside world
 * but rather exclusively communicate either with the JavaScript plugin
 * which embeds it or directly with SonarLint.
 *
 * @param port the port to listen to
 * @param host only for usage from outside of NodeJS - Java plugin, SonarLint, ...
 * @param timeout timeout in ms to shut down the server if unresponsive
 * @returns an http server
 */
function start(port = 0, host = '127.0.0.1', timeout = SHUTDOWN_TIMEOUT) {
    return new Promise(resolve => {
        (0, helpers_1.debug)(`starting eslint-bridge server at port ${port}`);
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        /**
         * Builds a timeout middleware to shut down the server
         * in case the process becomes orphan.
         */
        const orphanTimeout = (0, timeout_1.timeoutMiddleware)(() => {
            if (server.listening) {
                server.close();
            }
        }, timeout);
        /**
         * The order of the middlewares registration is important, as the
         * error handling one should be last.
         */
        app.use(express_1.default.json({ limit: MAX_REQUEST_SIZE }));
        app.use(orphanTimeout.middleware);
        app.use(routing_1.default);
        app.use(errors_1.errorMiddleware);
        app.post('/close', (_request, response) => {
            (0, helpers_1.debug)('eslint-bridge server will shutdown');
            response.end(() => {
                server.close();
            });
        });
        server.on('close', () => {
            (0, helpers_1.debug)('eslint-bridge server closed');
            orphanTimeout.stop();
        });
        server.on('error', (err) => {
            (0, helpers_1.debug)(`eslint-bridge server error: ${err}`);
        });
        server.on('listening', () => {
            var _a;
            /**
             * Since we use 0 as the default port, Node.js assigns a random port to the server,
             * which we get using server.address().
             */
            (0, helpers_1.debug)(`eslint-bridge server is running at port ${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`);
            resolve(server);
        });
        server.listen(port, host);
    });
}
exports.start = start;
//# sourceMappingURL=server.js.map