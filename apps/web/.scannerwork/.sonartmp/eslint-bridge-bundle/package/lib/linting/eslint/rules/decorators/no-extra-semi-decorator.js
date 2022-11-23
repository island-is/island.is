"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProtectionSemicolon = exports.decorateNoExtraSemi = void 0;
const helpers_1 = require("./helpers");
// core implementation of this rule raises issues when using semicolon-free style and
// using semicolon to protect code on purpose.
function decorateNoExtraSemi(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isProtectionSemicolon));
}
exports.decorateNoExtraSemi = decorateNoExtraSemi;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor && !exemptionCondition(context, reportDescriptor.node)) {
            context.report(reportDescriptor);
        }
    };
}
// Checks that a node is a semicolon inserted to prevent the compiler from merging the
// following statement with the previous.
function isProtectionSemicolon(context, node) {
    if (node.type !== 'EmptyStatement') {
        return false;
    }
    // This checks the semicolon is on a new line compared to the previous token if it exists.
    const previousToken = context.getSourceCode().getTokenBefore(node);
    if (!isNodeOnNewLineAfterToken(node, previousToken)) {
        return false;
    }
    const nextToken = context.getSourceCode().getTokenAfter(node);
    return isParenOrBracket(nextToken);
}
exports.isProtectionSemicolon = isProtectionSemicolon;
function isNodeOnNewLineAfterToken(node, token) {
    if (node.loc == null) {
        return false;
    }
    else if (token == null) {
        return true;
    }
    else {
        return token.loc.end.line < node.loc.start.line;
    }
}
function isParenOrBracket(token) {
    return (token === null || token === void 0 ? void 0 : token.type) === 'Punctuator' && (token.value === '[' || token.value === '(');
}
//# sourceMappingURL=no-extra-semi-decorator.js.map