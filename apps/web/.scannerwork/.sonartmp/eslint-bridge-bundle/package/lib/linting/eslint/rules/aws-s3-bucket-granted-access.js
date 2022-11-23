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
// https://sonarsource.github.io/rspec/#/rspec/S6265/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const parameters_1 = require("linting/eslint/linter/parameters");
const helpers_1 = require("./decorators/helpers");
const helpers_2 = require("./helpers");
const messages = {
    accessLevel: (param) => `Make sure granting ${param} access is safe here.`,
    unrestricted: 'Make sure allowing unrestricted access to objects from this bucket is safe here.',
};
const ACCESS_CONTROL_KEY = 'accessControl';
const INVALID_ACCESS_CONTROL_VALUES = ['PUBLIC_READ', 'PUBLIC_READ_WRITE', 'AUTHENTICATED_READ'];
const PUBLIC_READ_ACCESS_KEY = 'publicReadAccess';
const INVALID_PUBLIC_READ_ACCESS_VALUE = true;
exports.rule = {
    create(context) {
        return (0, helpers_1.mergeRules)(s3BucketConstructorRule.create(context), s3BucketDeploymentConstructorRule.create(context), handleGrantPublicAccess.create(context));
    },
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
};
const s3BucketConstructorRule = (0, helpers_2.S3BucketTemplate)((bucketConstructor, context) => {
    for (const value of INVALID_ACCESS_CONTROL_VALUES) {
        checkConstantParam(context, bucketConstructor, ACCESS_CONTROL_KEY, [
            'BucketAccessControl',
            value,
        ]);
    }
    checkBooleanParam(context, bucketConstructor, PUBLIC_READ_ACCESS_KEY, INVALID_PUBLIC_READ_ACCESS_VALUE);
});
const s3BucketDeploymentConstructorRule = {
    create(context) {
        return {
            NewExpression: (node) => {
                if ((0, helpers_2.isS3BucketDeploymentConstructor)(context, node)) {
                    for (const value of INVALID_ACCESS_CONTROL_VALUES) {
                        checkConstantParam(context, node, ACCESS_CONTROL_KEY, ['BucketAccessControl', value]);
                    }
                }
            },
        };
    },
};
function checkBooleanParam(context, bucketConstructor, propName, propValue) {
    const property = (0, helpers_2.getProperty)(context, bucketConstructor, propName);
    if (property == null) {
        return;
    }
    const propertyLiteralValue = (0, helpers_2.getValueOfExpression)(context, property.value, 'Literal');
    if ((propertyLiteralValue === null || propertyLiteralValue === void 0 ? void 0 : propertyLiteralValue.value) === propValue) {
        const secondary = (0, helpers_2.findPropagatedSetting)(property, propertyLiteralValue);
        context.report({
            message: (0, helpers_2.toEncodedMessage)(messages.unrestricted, secondary.locations, secondary.messages),
            node: property,
        });
    }
}
function checkConstantParam(context, bucketConstructor, propName, paramQualifiers) {
    const property = (0, helpers_2.getProperty)(context, bucketConstructor, propName);
    if (property == null) {
        return;
    }
    const propertyLiteralValue = (0, helpers_2.getValueOfExpression)(context, property.value, 'MemberExpression');
    if (propertyLiteralValue !== undefined &&
        (0, helpers_2.hasFullyQualifiedName)(context, propertyLiteralValue, 'aws-cdk-lib/aws-s3', ...paramQualifiers)) {
        const secondary = (0, helpers_2.findPropagatedSetting)(property, propertyLiteralValue);
        context.report({
            message: (0, helpers_2.toEncodedMessage)(messages.accessLevel(paramQualifiers[paramQualifiers.length - 1]), secondary.locations, secondary.messages),
            node: property,
        });
    }
}
const handleGrantPublicAccess = {
    create(context) {
        return {
            CallExpression: (node) => {
                if (!(0, helpers_2.isMethodCall)(node)) {
                    return;
                }
                const { object, property } = node.callee;
                const isGrantPublicAccessMethodCall = (0, helpers_2.isIdentifier)(property, 'grantPublicAccess');
                if (!isGrantPublicAccessMethodCall) {
                    return;
                }
                const variableAssignment = (0, helpers_2.getUniqueWriteUsageOrNode)(context, object);
                const isS3bucketInstance = variableAssignment.type === 'NewExpression' &&
                    (0, helpers_2.isS3BucketConstructor)(context, variableAssignment);
                if (!isS3bucketInstance) {
                    return;
                }
                context.report({
                    message: (0, helpers_2.toEncodedMessage)(messages.unrestricted),
                    node: property,
                });
            },
        };
    },
};
//# sourceMappingURL=aws-s3-bucket-granted-access.js.map