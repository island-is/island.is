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
// https://sonarsource.github.io/rspec/#/rspec/S6249/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const ENFORCE_SSL_KEY = 'enforceSSL';
const messages = {
    authorized: 'Make sure authorizing HTTP requests is safe here.',
    omitted: "Omitting 'enforceSSL' authorizes HTTP requests. Make sure it is safe here.",
};
exports.rule = (0, helpers_1.S3BucketTemplate)((bucket, context) => {
    const enforceSSLProperty = (0, helpers_1.getProperty)(context, bucket, ENFORCE_SSL_KEY);
    if (enforceSSLProperty == null) {
        context.report({
            message: messages['omitted'],
            node: bucket.callee,
        });
        return;
    }
    const enforceSSLValue = (0, helpers_1.getValueOfExpression)(context, enforceSSLProperty.value, 'Literal');
    if ((enforceSSLValue === null || enforceSSLValue === void 0 ? void 0 : enforceSSLValue.value) === false) {
        context.report({
            message: messages['authorized'],
            node: enforceSSLProperty,
        });
    }
});
//# sourceMappingURL=aws-s3-bucket-insecure-http.js.map