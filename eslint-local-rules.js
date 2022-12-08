'use strict'
const kennitala = require('kennitala')

module.exports = {
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
        if (kennitala.isValid(value)) {
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
            [`MethodDefinition[static=true][key.name='${name}'][value.async=true]`]: (
              node,
            ) => {
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
        "MethodDefinition[static=true] TSTypeReference[typeName.name='Promise'] TSTypeReference[typeName.name='DynamicModule']": (
          node,
        ) => {
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
}
