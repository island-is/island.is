"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEncodedMessage = void 0;
/**
 * Encodes an ESLint descriptor message with secondary locations
 *
 * The encoding consists in stringifying a JavaScript object with
 * `JSON.stringify` that includes the ESLint's descriptor message
 * along with second location information: message and location.
 *
 * This encoded message is eventually decoded by the linter wrapper
 * on the condition that the rule definition of the flagged problem
 * defines the internal `sonar-runtime` parameter in its schema.
 *
 * @param message the ESLint descriptor message
 * @param secondaryLocationsHolder the secondary locations
 * @param secondaryMessages the messages for each secondary location
 * @param cost the optional cost to fix
 * @returns the encoded message with secondary locations
 */
function toEncodedMessage(message, secondaryLocationsHolder = [], secondaryMessages, cost) {
    const encodedMessage = {
        message,
        cost,
        secondaryLocations: secondaryLocationsHolder.map((locationHolder, index) => toSecondaryLocation(locationHolder, !!secondaryMessages ? secondaryMessages[index] : undefined)),
    };
    return JSON.stringify(encodedMessage);
}
exports.toEncodedMessage = toEncodedMessage;
function toSecondaryLocation(locationHolder, message) {
    if (!locationHolder.loc) {
        throw new Error('Invalid secondary location');
    }
    return {
        message,
        column: locationHolder.loc.start.column,
        line: locationHolder.loc.start.line,
        endColumn: locationHolder.loc.end.column,
        endLine: locationHolder.loc.end.line,
    };
}
//# sourceMappingURL=location.js.map