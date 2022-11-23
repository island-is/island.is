"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignatureFromCallee = exports.getSymbolAtLocation = exports.getTypeAsString = exports.getTypeFromTreeNode = exports.isAny = exports.isThenable = exports.isUndefinedOrNull = exports.isFunction = exports.isStringType = exports.isNumberType = exports.isBigIntType = exports.isNumber = exports.isString = exports.isArray = void 0;
const typescript_1 = __importDefault(require("typescript"));
function isArray(node, services) {
    const type = getTypeFromTreeNode(node, services);
    return type.symbol && type.symbol.name === 'Array';
}
exports.isArray = isArray;
function isString(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return (typ.getFlags() & typescript_1.default.TypeFlags.StringLike) !== 0;
}
exports.isString = isString;
function isNumber(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return (typ.getFlags() & typescript_1.default.TypeFlags.NumberLike) !== 0;
}
exports.isNumber = isNumber;
function isBigIntType(type) {
    return (type.getFlags() & typescript_1.default.TypeFlags.BigIntLike) !== 0;
}
exports.isBigIntType = isBigIntType;
function isNumberType(type) {
    return (type.getFlags() & typescript_1.default.TypeFlags.NumberLike) !== 0;
}
exports.isNumberType = isNumberType;
function isStringType(type) {
    var _a;
    return (type.flags & typescript_1.default.TypeFlags.StringLike) > 0 || ((_a = type.symbol) === null || _a === void 0 ? void 0 : _a.name) === 'String';
}
exports.isStringType = isStringType;
function isFunction(node, services) {
    const checker = services.program.getTypeChecker();
    const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return type.symbol && (type.symbol.flags & typescript_1.default.SymbolFlags.Function) !== 0;
}
exports.isFunction = isFunction;
function isUndefinedOrNull(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return ((typ.getFlags() & typescript_1.default.TypeFlags.Undefined) !== 0 || (typ.getFlags() & typescript_1.default.TypeFlags.Null) !== 0);
}
exports.isUndefinedOrNull = isUndefinedOrNull;
function isThenable(node, services) {
    const mapped = services.esTreeNodeToTSNodeMap.get(node);
    const tp = services.program.getTypeChecker().getTypeAtLocation(mapped);
    const thenProperty = tp.getProperty('then');
    return Boolean(thenProperty && thenProperty.flags & typescript_1.default.SymbolFlags.Method);
}
exports.isThenable = isThenable;
function isAny(type) {
    return type.flags === typescript_1.default.TypeFlags.Any;
}
exports.isAny = isAny;
function getTypeFromTreeNode(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getTypeFromTreeNode = getTypeFromTreeNode;
function getTypeAsString(node, services) {
    const { typeToString, getBaseTypeOfLiteralType } = services.program.getTypeChecker();
    return typeToString(getBaseTypeOfLiteralType(getTypeFromTreeNode(node, services)));
}
exports.getTypeAsString = getTypeAsString;
function getSymbolAtLocation(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getSymbolAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSymbolAtLocation = getSymbolAtLocation;
function getSignatureFromCallee(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getResolvedSignature(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSignatureFromCallee = getSignatureFromCallee;
//# sourceMappingURL=type.js.map