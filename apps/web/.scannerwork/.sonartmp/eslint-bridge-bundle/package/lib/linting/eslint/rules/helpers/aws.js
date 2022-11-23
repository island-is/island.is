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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPropagatedSetting = exports.getProperty = exports.isS3BucketDeploymentConstructor = exports.isS3BucketConstructor = exports.S3BucketTemplate = void 0;
const _1 = require(".");
/**
 * A rule template for AWS S3 Buckets
 *
 * The rule template allows to detect sensitive configuration passed on
 * the invocation of S3 Bucket's constructor from AWS CDK:
 *
 * ```new s3.Bucket(...)```
 *
 * @param callback the callback invoked on visiting S3 Bucket's instantiation
 * @param metadata the instantiated rule metadata
 * @returns the instantiated rule definition
 */
function S3BucketTemplate(callback, metadata = { meta: {} }) {
    return {
        ...metadata,
        create(context) {
            return {
                NewExpression: (node) => {
                    if (isS3BucketConstructor(context, node)) {
                        callback(node, context);
                    }
                },
            };
        },
    };
}
exports.S3BucketTemplate = S3BucketTemplate;
/**
 * Detects S3 Bucket's constructor invocation from 'aws-cdk-lib/aws-s3':
 *
 * const s3 = require('aws-cdk-lib/aws-s3');
 * new s3.Bucket();
 */
function isS3BucketConstructor(context, node) {
    const { module, method } = (0, _1.getModuleAndCalledMethod)(node.callee, context);
    return (module === null || module === void 0 ? void 0 : module.value) === 'aws-cdk-lib/aws-s3' && (0, _1.isIdentifier)(method, 'Bucket');
}
exports.isS3BucketConstructor = isS3BucketConstructor;
/**
 * Detects S3 BucketDeployment's constructor invocation from 'aws-cdk-lib/aws-s3':
 *
 * const s3 = require('aws-cdk-lib/aws-s3');
 * new s3.BucketDeployment();
 */
function isS3BucketDeploymentConstructor(context, node) {
    const { module, method } = (0, _1.getModuleAndCalledMethod)(node.callee, context);
    return (module === null || module === void 0 ? void 0 : module.value) === 'aws-cdk-lib/aws-s3' && (0, _1.isIdentifier)(method, 'BucketDeployment');
}
exports.isS3BucketDeploymentConstructor = isS3BucketDeploymentConstructor;
/**
 * Extracts a property from the configuration argument of S3 Bucket's constructor
 *
 * ```
 * new s3.Bucket(_, _, { // config
 *  key1: value1,
 *  ...
 *  keyN: valueN
 * });
 * ```
 *
 * @param context the rule context
 * @param bucket the invocation of S3 Bucket's constructor
 * @param key the key of the property to extract
 * @returns the extracted property
 */
function getProperty(context, bucket, key) {
    const args = bucket.arguments;
    const optionsArg = args[2];
    const options = (0, _1.getValueOfExpression)(context, optionsArg, 'ObjectExpression');
    if (options == null) {
        return null;
    }
    return options.properties.find(property => (0, _1.isProperty)(property) && (0, _1.isIdentifier)(property.key, key));
}
exports.getProperty = getProperty;
/**
 * Finds the propagated setting of a sensitive property
 */
function findPropagatedSetting(sensitiveProperty, propagatedValue) {
    const propagated = { locations: [], messages: [] };
    const isPropagatedProperty = sensitiveProperty.value !== propagatedValue;
    if (isPropagatedProperty) {
        propagated.locations = [(0, _1.getNodeParent)(propagatedValue)];
        propagated.messages = ['Propagated setting.'];
    }
    return propagated;
}
exports.findPropagatedSetting = findPropagatedSetting;
//# sourceMappingURL=aws.js.map