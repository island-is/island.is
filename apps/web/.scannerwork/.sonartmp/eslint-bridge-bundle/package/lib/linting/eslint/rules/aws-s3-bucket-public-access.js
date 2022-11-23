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
// https://sonarsource.github.io/rspec/#/rspec/S6281/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const parameters_1 = require("linting/eslint/linter/parameters");
const helpers_1 = require("./helpers");
const BLOCK_PUBLIC_ACCESS_KEY = 'blockPublicAccess';
const BLOCK_PUBLIC_ACCESS_PROPERTY_KEYS = [
    'blockPublicAcls',
    'blockPublicPolicy',
    'ignorePublicAcls',
    'restrictPublicBuckets',
];
const messages = {
    omitted: 'No Public Access Block configuration prevents public ACL/policies ' +
        'to be set on this S3 bucket. Make sure it is safe here.',
    public: 'Make sure allowing public ACL/policies to be set is safe here.',
};
exports.rule = (0, helpers_1.S3BucketTemplate)((bucket, context) => {
    const blockPublicAccess = (0, helpers_1.getProperty)(context, bucket, BLOCK_PUBLIC_ACCESS_KEY);
    if (blockPublicAccess == null) {
        context.report({
            message: (0, helpers_1.toEncodedMessage)(messages['omitted']),
            node: bucket.callee,
        });
    }
    else {
        checkBlockPublicAccessValue(blockPublicAccess);
        checkBlockPublicAccessConstructor(blockPublicAccess);
    }
    /** Checks `blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS` sensitive pattern */
    function checkBlockPublicAccessValue(blockPublicAccess) {
        const blockPublicAccessMember = (0, helpers_1.getValueOfExpression)(context, blockPublicAccess.value, 'MemberExpression');
        if (blockPublicAccessMember !== undefined &&
            (0, helpers_1.hasFullyQualifiedName)(context, blockPublicAccessMember, 'aws-cdk-lib/aws-s3', 'BlockPublicAccess', 'BLOCK_ACLS')) {
            const propagated = (0, helpers_1.findPropagatedSetting)(blockPublicAccess, blockPublicAccessMember);
            context.report({
                message: (0, helpers_1.toEncodedMessage)(messages['public'], propagated.locations, propagated.messages),
                node: blockPublicAccess,
            });
        }
    }
    /** Checks `blockPublicAccess: new s3.BlockPublicAccess({...})` sensitive pattern */
    function checkBlockPublicAccessConstructor(blockPublicAccess) {
        const blockPublicAccessNew = (0, helpers_1.getValueOfExpression)(context, blockPublicAccess.value, 'NewExpression');
        if (blockPublicAccessNew !== undefined &&
            isS3BlockPublicAccessConstructor(blockPublicAccessNew)) {
            const blockPublicAccessConfig = (0, helpers_1.getValueOfExpression)(context, blockPublicAccessNew.arguments[0], 'ObjectExpression');
            if (blockPublicAccessConfig === undefined) {
                context.report({
                    message: (0, helpers_1.toEncodedMessage)(messages['omitted']),
                    node: blockPublicAccessNew,
                });
            }
            else {
                BLOCK_PUBLIC_ACCESS_PROPERTY_KEYS.forEach(key => checkBlockPublicAccessConstructorProperty(blockPublicAccessConfig, key));
            }
        }
        function checkBlockPublicAccessConstructorProperty(blockPublicAccessConfig, key) {
            const blockPublicAccessProperty = blockPublicAccessConfig.properties.find(property => (0, helpers_1.isProperty)(property) && (0, helpers_1.isIdentifier)(property.key, key));
            if (blockPublicAccessProperty !== undefined) {
                const blockPublicAccessValue = (0, helpers_1.getValueOfExpression)(context, blockPublicAccessProperty.value, 'Literal');
                if ((blockPublicAccessValue === null || blockPublicAccessValue === void 0 ? void 0 : blockPublicAccessValue.value) === false) {
                    const propagated = (0, helpers_1.findPropagatedSetting)(blockPublicAccessProperty, blockPublicAccessValue);
                    context.report({
                        message: (0, helpers_1.toEncodedMessage)(messages['public'], propagated.locations, propagated.messages),
                        node: blockPublicAccessProperty,
                    });
                }
            }
        }
        function isS3BlockPublicAccessConstructor(expr) {
            return (expr.callee.type === 'MemberExpression' &&
                (0, helpers_1.hasFullyQualifiedName)(context, expr.callee, 'aws-cdk-lib/aws-s3', 'BlockPublicAccess'));
        }
    }
}, {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
});
//# sourceMappingURL=aws-s3-bucket-public-access.js.map