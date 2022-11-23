"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeSyntheticFilePath = exports.buildSourceCodes = void 0;
const jsts_1 = require("parsing/jsts");
const yaml_1 = require("parsing/yaml");
const patch_1 = require("./patch");
const lodash_clone_1 = __importDefault(require("lodash.clone"));
const path_1 = __importDefault(require("path"));
/**
 * Builds ESLint SourceCode instances for every embedded JavaScript snippet in the YAML file.
 *
 * The filepath is augmented with the AWS function name, returned as the syntheticFilePath property
 *
 * If there is at least one parsing error in any snippet, we return only the first error and
 * we don't even consider any parsing errors in the remaining snippets for simplicity.
 */
function buildSourceCodes(filePath) {
    const embeddedJSs = (0, yaml_1.parseAwsFromYaml)(filePath);
    const extendedSourceCodes = [];
    for (const embeddedJS of embeddedJSs) {
        const { code } = embeddedJS;
        let syntheticFilePath = filePath;
        if (embeddedJS.extras.resourceName != null) {
            syntheticFilePath = composeSyntheticFilePath(filePath, embeddedJS.extras.resourceName);
        }
        /**
         * The file path is purposely left empty as it is ignored by `buildSourceCode` if
         * the file content is provided, which happens to be the case here since `code`
         * denotes an embedded JavaScript snippet extracted from the YAML file.
         */
        const input = { filePath: '', fileContent: code, fileType: 'MAIN' };
        try {
            const sourceCode = (0, jsts_1.buildSourceCode)(input, 'js');
            const patchedSourceCode = (0, patch_1.patchSourceCode)(sourceCode, embeddedJS);
            // We use lodash.clone here to remove the effects of Object.preventExtensions()
            const extendedSourceCode = Object.assign((0, lodash_clone_1.default)(patchedSourceCode), {
                syntheticFilePath,
            });
            extendedSourceCodes.push(extendedSourceCode);
        }
        catch (error) {
            throw (0, patch_1.patchParsingError)(error, embeddedJS);
        }
    }
    return extendedSourceCodes;
}
exports.buildSourceCodes = buildSourceCodes;
/**
 * Returns the filename composed as following:
 *
 * {filepath-without-extention}-{resourceName}{filepath-extension}
 */
function composeSyntheticFilePath(filePath, resourceName) {
    const { dir, name, ext } = path_1.default.parse(filePath);
    return path_1.default.format({
        dir,
        name: `${name}-${resourceName}`,
        ext,
    });
}
exports.composeSyntheticFilePath = composeSyntheticFilePath;
//# sourceMappingURL=build.js.map