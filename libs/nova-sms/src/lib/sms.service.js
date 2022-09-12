"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SmsService = exports.SMS_OPTIONS = exports.NovaError = void 0;
var apollo_datasource_rest_1 = require("apollo-datasource-rest");
var common_1 = require("@nestjs/common");
var logging_1 = require("@island.is/logging");
var NovaError = /** @class */ (function (_super) {
    __extends(NovaError, _super);
    function NovaError(code, message) {
        var _this = _super.call(this) || this;
        var errorCodes = {
            '0': 'Code 0: Operation Successful',
            '1': 'Code 1: Action failed',
            '10': 'Code 10: Authentication Failure',
            '20': 'Code 20: Failure during token generation',
            '30': 'Code 30: Missing login credentials',
            '1001': 'Code 1001: Unexpected Error'
        };
        var codeMessage = "Unknown error code: " + code;
        if (code && Object.keys(errorCodes).includes(code.toString())) {
            codeMessage = errorCodes[code.toString()];
        }
        _this.name = 'NovaError';
        _this.message = codeMessage + ", " + message;
        return _this;
    }
    return NovaError;
}(Error));
exports.NovaError = NovaError;
var token;
exports.SMS_OPTIONS = 'SMS_OPTIONS';
var SmsService = /** @class */ (function (_super) {
    __extends(SmsService, _super);
    function SmsService(options, logger) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = logger;
        _this.baseURL = _this.options.url + "/NovaSmsService/";
        _this.initialize({});
        return _this;
    }
    SmsService.prototype.willSendRequest = function (request) {
        this.memoizedResults.clear();
        request.headers.set('Content-Type', 'application/json');
    };
    SmsService.prototype.login = function () {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1, code, message;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.post('Login', undefined, {
                                headers: {
                                    username: this.options.username,
                                    password: this.options.password
                                }
                            })];
                    case 1:
                        res = _g.sent();
                        this.logger.info('Successfully authenticated with Nova');
                        return [2 /*return*/, res.Token];
                    case 2:
                        error_1 = _g.sent();
                        code = (_c = (_b = (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.extensions) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.Code;
                        message = ((_f = (_e = (_d = error_1 === null || error_1 === void 0 ? void 0 : error_1.extensions) === null || _d === void 0 ? void 0 : _d.response) === null || _e === void 0 ? void 0 : _e.body) === null || _f === void 0 ? void 0 : _f.Message) || error_1.message;
                        throw new NovaError(code, message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SmsService.prototype.wrappedPost = function (url, body, isRetry) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (isRetry === void 0) { isRetry = false; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2, status_1, code, message;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!!token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login()];
                    case 1:
                        token = _j.sent();
                        _j.label = 2;
                    case 2:
                        _j.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, this.post(url, body, {
                                headers: {
                                    token: token
                                }
                            })];
                    case 3:
                        res = _j.sent();
                        return [2 /*return*/, res];
                    case 4:
                        error_2 = _j.sent();
                        status_1 = (_b = (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.extensions) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.status;
                        if (!(!isRetry && status_1 === 401)) return [3 /*break*/, 6];
                        this.logger.info('Nova returned 401, refreshing auth token');
                        return [4 /*yield*/, this.login()];
                    case 5:
                        token = _j.sent();
                        return [2 /*return*/, this.wrappedPost(url, body, true)];
                    case 6:
                        code = (_e = (_d = (_c = error_2 === null || error_2 === void 0 ? void 0 : error_2.extensions) === null || _c === void 0 ? void 0 : _c.response) === null || _d === void 0 ? void 0 : _d.body) === null || _e === void 0 ? void 0 : _e.Code;
                        message = ((_h = (_g = (_f = error_2 === null || error_2 === void 0 ? void 0 : error_2.extensions) === null || _f === void 0 ? void 0 : _f.response) === null || _g === void 0 ? void 0 : _g.body) === null || _h === void 0 ? void 0 : _h.Message) || (error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                        throw new NovaError(code, message);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SmsService.prototype.sendSms = function (recipients, message) {
        this.logger.debug("Sending sms to " + recipients + " with message " + message);
        var body = {
            request: {
                Recipients: typeof recipients === 'string' ? [recipients] : recipients,
                SenderName: 'Island.is',
                SmsText: message,
                IsFlash: false
            }
        };
        return this.wrappedPost('SendSms', body);
    };
    SmsService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, common_1.Inject)(exports.SMS_OPTIONS)),
        __param(1, (0, common_1.Inject)(logging_1.LOGGER_PROVIDER))
    ], SmsService);
    return SmsService;
}(apollo_datasource_rest_1.RESTDataSource));
exports.SmsService = SmsService;
