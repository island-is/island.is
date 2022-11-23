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
// https://sonarsource.github.io/rspec/#/rspec/S5693/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const file_uploads_1 = require("./file-uploads");
const bytes_1 = require("bytes");
const helpers_1 = require("./helpers");
const FORMIDABLE_MODULE = 'formidable';
const MAX_FILE_SIZE = 'maxFileSize';
const FORMIDABLE_DEFAULT_SIZE = 200 * 1024 * 1024;
const MULTER_MODULE = 'multer';
const LIMITS_OPTION = 'limits';
const FILE_SIZE_OPTION = 'fileSize';
const BODY_PARSER_MODULE = 'body-parser';
const BODY_PARSER_DEFAULT_SIZE = (0, bytes_1.parse)('100kb');
const formidableObjects = new Map();
exports.rule = {
    meta: {
        messages: {
            safeLimit: 'Make sure the content length limit is safe here.',
        },
    },
    create(context) {
        return {
            NewExpression(node) {
                checkCallExpression(context, node);
            },
            CallExpression(node) {
                checkCallExpression(context, node);
            },
            AssignmentExpression(node) {
                visitAssignment(context, node);
            },
            Program() {
                formidableObjects.clear();
            },
            'Program:exit'() {
                formidableObjects.forEach(value => report(context, value.nodeToReport, value.maxFileSize));
            },
        };
    },
};
function checkCallExpression(context, callExpression) {
    const { callee } = callExpression;
    let identifierFromModule;
    if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier') {
        identifierFromModule = callee.object;
    }
    else if (callee.type === 'Identifier') {
        identifierFromModule = callee;
    }
    else {
        return;
    }
    const moduleName = (0, helpers_1.getModuleNameOfImportedIdentifier)(context, identifierFromModule) ||
        (0, helpers_1.getModuleNameOfIdentifier)(context, identifierFromModule);
    if (!moduleName) {
        return;
    }
    if (moduleName.value === FORMIDABLE_MODULE) {
        checkFormidable(context, callExpression);
    }
    if (moduleName.value === MULTER_MODULE) {
        checkMulter(context, callExpression);
    }
    if (moduleName.value === BODY_PARSER_MODULE) {
        checkBodyParser(context, callExpression);
    }
}
function checkFormidable(context, callExpression) {
    if (callExpression.arguments.length === 0) {
        // options will be set later through member assignment
        const formVariable = (0, helpers_1.getLhsVariable)(context);
        if (formVariable) {
            formidableObjects.set(formVariable, {
                maxFileSize: FORMIDABLE_DEFAULT_SIZE,
                nodeToReport: callExpression,
            });
        }
        return;
    }
    const options = (0, helpers_1.getValueOfExpression)(context, callExpression.arguments[0], 'ObjectExpression');
    if (options) {
        const property = (0, helpers_1.getObjectExpressionProperty)(options, MAX_FILE_SIZE);
        checkSize(context, callExpression, property, FORMIDABLE_DEFAULT_SIZE);
    }
}
function checkMulter(context, callExpression) {
    var _a;
    if (callExpression.arguments.length === 0) {
        report(context, callExpression.callee);
        return;
    }
    const multerOptions = (0, helpers_1.getValueOfExpression)(context, callExpression.arguments[0], 'ObjectExpression');
    if (!multerOptions) {
        return;
    }
    const limitsPropertyValue = (_a = (0, helpers_1.getObjectExpressionProperty)(multerOptions, LIMITS_OPTION)) === null || _a === void 0 ? void 0 : _a.value;
    if (limitsPropertyValue && limitsPropertyValue.type === 'ObjectExpression') {
        const fileSizeProperty = (0, helpers_1.getObjectExpressionProperty)(limitsPropertyValue, FILE_SIZE_OPTION);
        checkSize(context, callExpression, fileSizeProperty);
    }
    if (!limitsPropertyValue) {
        report(context, callExpression.callee);
    }
}
function checkBodyParser(context, callExpression) {
    if (callExpression.arguments.length === 0) {
        checkSize(context, callExpression, undefined, BODY_PARSER_DEFAULT_SIZE, true);
        return;
    }
    const options = (0, helpers_1.getValueOfExpression)(context, callExpression.arguments[0], 'ObjectExpression');
    if (!options) {
        return;
    }
    const limitsProperty = (0, helpers_1.getObjectExpressionProperty)(options, LIMITS_OPTION);
    checkSize(context, callExpression, limitsProperty, BODY_PARSER_DEFAULT_SIZE, true);
}
function checkSize(context, callExpr, property, defaultLimit, useStandardSizeLimit = false) {
    if (property) {
        const maxFileSizeValue = getSizeValue(context, property.value);
        if (maxFileSizeValue) {
            report(context, property, maxFileSizeValue, useStandardSizeLimit);
        }
    }
    else {
        report(context, callExpr, defaultLimit, useStandardSizeLimit);
    }
}
function visitAssignment(context, assignment) {
    const variableProperty = (0, file_uploads_1.getVariablePropertyFromAssignment)(context, assignment);
    if (!variableProperty) {
        return;
    }
    const { objectVariable, property } = variableProperty;
    if (formidableObjects.has(objectVariable) && property === MAX_FILE_SIZE) {
        const formOptions = formidableObjects.get(objectVariable);
        const rhsValue = getSizeValue(context, assignment.right);
        if (rhsValue !== undefined) {
            formOptions.maxFileSize = rhsValue;
            formOptions.nodeToReport = assignment;
        }
        else {
            formidableObjects.delete(objectVariable);
        }
    }
}
function getSizeValue(context, node) {
    const literal = (0, helpers_1.getValueOfExpression)(context, node, 'Literal');
    if (literal) {
        if (typeof literal.value === 'number') {
            return literal.value;
        }
        else if (typeof literal.value === 'string') {
            return (0, bytes_1.parse)(literal.value);
        }
    }
    return undefined;
}
function report(context, nodeToReport, size, useStandardSizeLimit = false) {
    const [fileUploadSizeLimit, standardSizeLimit] = context.options;
    const limitToCompare = useStandardSizeLimit ? standardSizeLimit : fileUploadSizeLimit;
    if (!size || size > limitToCompare) {
        context.report({
            messageId: 'safeLimit',
            node: nodeToReport,
        });
    }
}
//# sourceMappingURL=content-length.js.map