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
// https://sonarsource.github.io/rspec/#/rspec/S4275/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
    create(context) {
        const currentFieldsStack = [new Map()];
        function checkAccessor(accessor) {
            const accessorIsPublic = accessor.type !== 'MethodDefinition' || accessor.accessibility === 'public';
            const accessorInfo = getAccessorInfo(accessor);
            const statements = getFunctionBody(accessor.value);
            if (!accessorInfo || !accessorIsPublic || !statements || statements.length > 1) {
                return;
            }
            const matchingFields = findMatchingFields(currentFieldsStack[currentFieldsStack.length - 1], accessorInfo.name);
            if (matchingFields.length > 0 &&
                (statements.length === 0 ||
                    !isUsingAccessorFieldInBody(statements[0], accessorInfo, matchingFields))) {
                const fieldToRefer = matchingFields[0];
                const primaryMessage = `Refactor this ${accessorInfo.type} ` +
                    `so that it actually refers to the property '${fieldToRefer.name}'.`;
                const secondaryLocations = [fieldToRefer.node];
                const secondaryMessages = ['Property which should be referred.'];
                context.report({
                    message: (0, helpers_1.toEncodedMessage)(primaryMessage, secondaryLocations, secondaryMessages),
                    loc: accessor.key.loc,
                });
            }
        }
        return {
            Property: (node) => checkAccessor(node),
            MethodDefinition: (node) => checkAccessor(node),
            ClassBody: (node) => {
                const classBody = node;
                const fields = getFieldMap(classBody.body, classElement => (classElement.type === 'PropertyDefinition' ||
                    classElement.type === 'TSAbstractPropertyDefinition') &&
                    !classElement.static
                    ? classElement.key
                    : null);
                const fieldsFromConstructor = fieldsDeclaredInConstructorParameters(classBody);
                const allFields = new Map([...fields, ...fieldsFromConstructor]);
                currentFieldsStack.push(allFields);
            },
            ObjectExpression: (node) => {
                const currentFields = getFieldMap(node.properties, prop => isValidObjectField(prop) ? prop.key : null);
                currentFieldsStack.push(currentFields);
            },
            ':matches(ClassBody, ObjectExpression):exit': () => {
                currentFieldsStack.pop();
            },
        };
    },
};
function getAccessorInfo(accessor) {
    let name = getName(accessor.key);
    if (!name) {
        return null;
    }
    name = name.toLowerCase();
    if (accessor.kind === 'get') {
        return { type: 'getter', name };
    }
    else if (accessor.kind === 'set') {
        return { type: 'setter', name };
    }
    else {
        return setterOrGetter(name, accessor.value);
    }
}
function getName(key) {
    if (key.type === 'Literal') {
        return String(key.value);
    }
    else if (key.type === 'Identifier') {
        return key.name;
    }
    return null;
}
function setterOrGetter(name, functionExpression) {
    if (functionExpression.type !== 'FunctionExpression') {
        return null;
    }
    if (name.startsWith('set') && functionExpression.params.length === 1) {
        return { type: 'setter', name: name.substring(3) };
    }
    if (name.startsWith('get') && functionExpression.params.length === 0) {
        return { type: 'getter', name: name.substring(3) };
    }
    return null;
}
function getFieldMap(elements, getPropertyName) {
    const fields = new Map();
    for (const element of elements) {
        const propertyNameNode = getPropertyName(element);
        if (propertyNameNode) {
            const name = getName(propertyNameNode);
            if (name) {
                fields.set(name.toLowerCase(), {
                    name,
                    node: element,
                });
            }
        }
    }
    return fields;
}
function isValidObjectField(prop) {
    return prop.type === 'Property' && !prop.method && prop.kind === 'init';
}
function fieldsDeclaredInConstructorParameters(containingClass) {
    const constr = getConstructorOf(containingClass);
    if (constr) {
        const fieldsFromConstructor = new Map();
        for (const parameter of constr.params) {
            if (parameter.type === 'TSParameterProperty' &&
                (parameter.accessibility || parameter.readonly)) {
                const parameterName = getName(parameter.parameter);
                if (parameterName) {
                    fieldsFromConstructor.set(parameterName, {
                        name: parameterName,
                        node: parameter,
                    });
                }
            }
        }
        return fieldsFromConstructor;
    }
    else {
        return new Map();
    }
}
function getConstructorOf(containingClass) {
    for (const classElement of containingClass.body) {
        if (classElement.type === 'MethodDefinition' && getName(classElement.key) === 'constructor') {
            return classElement.value;
        }
    }
}
function findMatchingFields(currentFields, name) {
    const underscoredTargetName1 = `_${name}`;
    const underscoredTargetName2 = `${name}_`;
    const exactFieldName = currentFields.get(name);
    const underscoreFieldName1 = currentFields.get(underscoredTargetName1);
    const underscoreFieldName2 = currentFields.get(underscoredTargetName2);
    return [exactFieldName, underscoreFieldName1, underscoreFieldName2].filter(field => field);
}
function getFunctionBody(node) {
    if (node.type !== 'FunctionExpression' || !node.body) {
        return null;
    }
    return node.body.body;
}
function getPropertyName(expression) {
    if (expression &&
        expression.type === 'MemberExpression' &&
        expression.object.type === 'ThisExpression') {
        return getName(expression.property);
    }
    return null;
}
function getFieldUsedInsideSimpleBody(statement, accessorInfo) {
    if (accessorInfo.type === 'setter') {
        if (statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'AssignmentExpression') {
            return getPropertyName(statement.expression.left);
        }
    }
    else if (statement.type === 'ReturnStatement') {
        return getPropertyName(statement.argument);
    }
    return null;
}
function isUsingAccessorFieldInBody(statement, accessorInfo, matchingFields) {
    const usedField = getFieldUsedInsideSimpleBody(statement, accessorInfo);
    return !usedField || matchingFields.some(matchingField => usedField === matchingField.name);
}
//# sourceMappingURL=no-accessor-field-mismatch.js.map