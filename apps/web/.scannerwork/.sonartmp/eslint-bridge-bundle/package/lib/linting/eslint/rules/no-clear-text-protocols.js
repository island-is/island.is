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
// https://sonarsource.github.io/rspec/#/rspec/S5332/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const url_1 = require("url");
const helpers_1 = require("./helpers");
const INSECURE_PROTOCOLS = ['http://', 'ftp://', 'telnet://'];
const LOOPBACK_PATTERN = /localhost|127(?:\.[0-9]+){0,2}\.[0-9]+$|\/\/(?:0*\:)*?:?0*1$/;
const EXCEPTION_FULL_HOSTS = [
    'www.w3.org',
    'xml.apache.org',
    'schemas.xmlsoap.org',
    'schemas.openxmlformats.org',
    'rdfs.org',
    'purl.org',
    'xmlns.com',
    'schemas.google.com',
    'a9.com',
    'ns.adobe.com',
    'ltsc.ieee.org',
    'docbook.org',
    'graphml.graphdrawing.org',
    'json-schema.org',
];
const EXCEPTION_TOP_HOSTS = [/(.*\.)?example\.com$/, /(.*\.)?example\.org$/, /(.*\.)?test\.com$/];
exports.rule = {
    meta: {
        messages: {
            insecureProtocol: 'Using {{protocol}} protocol is insecure. Use {{alternative}} instead.',
        },
    },
    create(context) {
        function checkNodemailer(callExpression) {
            const firstArg = callExpression.arguments.length > 0 ? callExpression.arguments[0] : null;
            if (!firstArg) {
                return;
            }
            const firstArgValue = (0, helpers_1.getValueOfExpression)(context, firstArg, 'ObjectExpression');
            const secure = (0, helpers_1.getObjectExpressionProperty)(firstArgValue, 'secure');
            const requireTls = (0, helpers_1.getObjectExpressionProperty)(firstArgValue, 'requireTLS');
            const port = (0, helpers_1.getObjectExpressionProperty)(firstArgValue, 'port');
            if (secure && (secure.value.type !== 'Literal' || secure.value.raw !== 'false')) {
                return;
            }
            if (requireTls && (requireTls.value.type !== 'Literal' || requireTls.value.raw !== 'false')) {
                return;
            }
            if (port && (port.value.type !== 'Literal' || port.value.raw === '465')) {
                return;
            }
            context.report({ node: callExpression.callee, ...getMessageAndData('http') });
        }
        function checkCallToFtp(callExpression) {
            var _a;
            if (callExpression.callee.type === 'MemberExpression' &&
                callExpression.callee.property.type === 'Identifier' &&
                callExpression.callee.property.name === 'connect') {
                const newExpression = (0, helpers_1.getValueOfExpression)(context, callExpression.callee.object, 'NewExpression');
                if (!!newExpression &&
                    ((_a = (0, helpers_1.getModuleNameOfNode)(context, newExpression.callee)) === null || _a === void 0 ? void 0 : _a.value) === 'ftp') {
                    const firstArg = callExpression.arguments.length > 0 ? callExpression.arguments[0] : null;
                    if (!firstArg) {
                        return;
                    }
                    const firstArgValue = (0, helpers_1.getValueOfExpression)(context, firstArg, 'ObjectExpression');
                    const secure = (0, helpers_1.getObjectExpressionProperty)(firstArgValue, 'secure');
                    if (secure && secure.value.type === 'Literal' && secure.value.raw === 'false') {
                        context.report({
                            node: callExpression.callee,
                            ...getMessageAndData('ftp'),
                        });
                    }
                }
            }
        }
        function checkCallToRequire(callExpression) {
            if (callExpression.callee.type === 'Identifier' && callExpression.callee.name === 'require') {
                const firstArg = callExpression.arguments.length > 0 ? callExpression.arguments[0] : null;
                if (firstArg &&
                    firstArg.type === 'Literal' &&
                    typeof firstArg.value === 'string' &&
                    firstArg.value === 'telnet-client') {
                    context.report({
                        node: firstArg,
                        ...getMessageAndData('telnet'),
                    });
                }
            }
        }
        function isExceptionUrl(value) {
            if (INSECURE_PROTOCOLS.includes(value)) {
                const parent = (0, helpers_1.getParent)(context);
                return !((parent === null || parent === void 0 ? void 0 : parent.type) === 'BinaryExpression' && parent.operator === '+');
            }
            return hasExceptionHost(value);
        }
        function hasExceptionHost(value) {
            let url;
            try {
                url = new url_1.URL(value);
            }
            catch (err) {
                return false;
            }
            const host = url.hostname;
            return (host.length === 0 ||
                LOOPBACK_PATTERN.test(host) ||
                EXCEPTION_FULL_HOSTS.some(exception => exception === host) ||
                EXCEPTION_TOP_HOSTS.some(exception => exception.test(host)));
        }
        return {
            Literal: (node) => {
                const literal = node;
                if (typeof literal.value === 'string') {
                    const value = literal.value.trim().toLocaleLowerCase();
                    const insecure = INSECURE_PROTOCOLS.find(protocol => value.startsWith(protocol));
                    if (insecure && !isExceptionUrl(value)) {
                        const protocol = insecure.substring(0, insecure.indexOf(':'));
                        context.report({
                            ...getMessageAndData(protocol),
                            node,
                        });
                    }
                }
            },
            CallExpression: (node) => {
                const callExpression = node;
                if ((0, helpers_1.isCallToFQN)(context, callExpression, 'nodemailer', 'createTransport')) {
                    checkNodemailer(callExpression);
                }
                checkCallToFtp(callExpression);
                checkCallToRequire(callExpression);
            },
            ImportDeclaration: (node) => {
                const importDeclaration = node;
                if (typeof importDeclaration.source.value === 'string' &&
                    importDeclaration.source.value === 'telnet-client') {
                    context.report({
                        node: importDeclaration.source,
                        ...getMessageAndData('telnet'),
                    });
                }
            },
        };
    },
};
function getMessageAndData(protocol) {
    let alternative;
    switch (protocol) {
        case 'http':
            alternative = 'https';
            break;
        case 'ftp':
            alternative = 'sftp, scp or ftps';
            break;
        default:
            alternative = 'ssh';
    }
    return { messageId: 'insecureProtocol', data: { protocol, alternative } };
}
//# sourceMappingURL=no-clear-text-protocols.js.map