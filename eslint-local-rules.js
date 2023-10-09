'use strict'
import { isValid } from 'kennitala'
const fakeNationalIdPrefixes = ['010130', /(\d+)\1{6,}/]

export default {
  'require-reduce-defaults': {
    meta: {
      type: 'problem',
      docs: {
        description: 'require a default value when using .reduce()',
        category: 'Possible Errors',
        recommended: true,
      },
      schema: [],
    },
    create: function (context) {
      return {
        "CallExpression[arguments.length=1] > MemberExpression.callee > Identifier.property[name='reduce']":
          (node) => {
            context.report({
              node,
              message: 'Provide initialValue to .reduce().',
            })
          },
      }
    },
  },
  'disallow-kennitalas': {
    meta: {
      docs: {
        description: 'disallow kennitalas',
        category: 'Possible Errors',
        recommended: true,
      },
      schema: [],
    },
    create: function (context) {
      function checkKennitala(value, node) {
        if (
          isValid(value) &&
          !fakeNationalIdPrefixes.some(
            (nID) => new String(value).search(nID) >= 0,
          )
        ) {
          context.report({
            node: node,
            message: `Found valid SSN: ${value}`,
          })
        }
      }
      return {
        Literal(node) {
          const { value } = node
          checkKennitala(value, node)
        },
        TemplateElement(node) {
          if (!node.value) return
          const value = node.value.cooked
          checkKennitala(value, node)
        },
      }
    },
  },
  'no-async-module-init': {
    meta: {
      type: 'problem',
      docs: {
        description: 'disallow async module initialisation',
        category: 'Possible Errors',
        recommended: true,
      },
      messages: {
        noAsyncRegister:
          'Disallowing static async {{ name }} function in modules to prevent unexpected startup failures or timeouts.',
        noAsyncProviderFactory:
          'Disallowing async useFactory in module providers to prevent unexpected startup failures or timeouts.',
        noReturnPromiseDynamicModule:
          'Disallowing static async functions with returnType Promise<DynamicModule> in modules to prevent unexpected startup failures or timeouts.',
      },
    },
    schema: [],
    create: function (context) {
      const nameSymbols = [
        'register',
        'forRoot',
        'forRootAsync',
        'forFeature',
        'forFeatureAsync',
      ]

      const rules = {
        ...nameSymbols.reduce((rules, name) => {
          return {
            ...rules,
            [`MethodDefinition[static=true][key.name='${name}'][value.async=true]`]:
              (node) => {
                context.report({
                  node,
                  messageId: 'noAsyncRegister',
                  data: {
                    name,
                  },
                })
              },
          }
        }, {}),
        "MethodDefinition[static=true] TSTypeReference[typeName.name='Promise'] TSTypeReference[typeName.name='DynamicModule']":
          (node) => {
            context.report({
              node,
              messageId: 'noReturnPromiseDynamicModule',
            })
          },
        "Property[key.name='useFactory'][value.async=true]": (node) => {
          context.report({
            node,
            messageId: 'noAsyncProviderFactory',
          })
        },
      }

      return rules
    },
  },
  /**
   * This rule is used to enforce the use of CacheField decorator or explicit cache control on all fields that resolve
   * to an object. Otherwise, these fields may disable caching for the whole response:
   *
   * https://www.apollographql.com/docs/apollo-server/performance/caching/#calculating-cache-behavior
   *
   * This is mainly relevant for the CMS domain, where we use persistent cached GET queries and Apollo response caching.
   *
   * Generally, each root resolver should specify a maxAge based on the frequency of updates to the underlying data.
   * Field resolvers which fetch data can configure their own maxAge. All other non-scalar fields should configure
   * `@CacheControl(inheritFromParent: true)`, which `@CacheField` does automatically.
   */
  'require-cache-control': {
    meta: {
      type: 'problem',
      hasSuggestions: true,
      docs: {
        description: 'require cache control for graphql field',
        category: 'Possible Errors',
        recommended: true,
      },
      messages: {
        noCacheControl:
          'Fields resolving as objects should configure cache control to not break caching-logic in Apollo.',
      },
    },
    schema: [],
    create: function (context) {
      const scalarTypes = [
        'ID',
        'String',
        'Boolean',
        'Int',
        'Float',
        'Number',
        'Date',
      ]
      let hasImport = false
      let lastImport = null
      return {
        ImportDeclaration: (node) => {
          lastImport = node
        },
        'ImportDeclaration ImportSpecifier[local.name=CacheField]': (node) => {
          hasImport = true
          lastImport = node
        },
        'PropertyDefinition > Decorator > CallExpression[callee.name=Field] > ArrowFunctionExpression.arguments:first-child > .body':
          (node) => {
            const identifierName =
              node.type === 'Identifier'
                ? node.name
                : node.type === 'ArrayExpression' &&
                  node.elements[0].type === 'Identifier'
                ? node.elements[0].name
                : null

            const isScalarType =
              identifierName === null ||
              scalarTypes.includes(identifierName) ||
              identifierName.match(/json/i)
            const callExpressionNode = node.parent.parent
            const propertyNode = callExpressionNode.parent.parent
            const hasCacheControl = propertyNode.decorators.find(
              (decorator) =>
                decorator.expression?.callee?.name === 'CacheControl',
            )
            if (isScalarType || hasCacheControl) {
              return
            }

            context.report({
              node: callExpressionNode,
              messageId: 'noCacheControl',
              suggest: [
                {
                  desc: 'Use @CacheField() instead.',
                  fix: (fixer) => {
                    const fixes = [
                      fixer.replaceText(
                        callExpressionNode.callee,
                        'CacheField',
                      ),
                    ]
                    if (!hasImport) {
                      const newImport =
                        "import { CacheField } from '@island.is/nest/graphql';"
                      if (lastImport) {
                        // insert after the last import decl
                        fixes.push(
                          fixer.insertTextAfter(lastImport, `\n${newImport}`),
                        )
                      } else {
                        // insert at the start of the file
                        fixes.push(
                          fixer.insertTextAfterRange([0, 0], `${newImport}\n`),
                        )
                      }
                    }
                    return fixes
                  },
                },
              ],
            })
          },
      }
    },
  },
}
