"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestCode = exports.isMainCode = void 0;
function isMainCode(context) {
    return !isTestCode(context);
}
exports.isMainCode = isMainCode;
function isTestCode(context) {
    return getFileType(context) === 'TEST';
}
exports.isTestCode = isTestCode;
function getFileType(context) {
    return context.settings['fileType'];
}
//# sourceMappingURL=file.js.map