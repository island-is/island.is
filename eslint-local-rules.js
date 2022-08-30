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
        url: '',
      },
      messages: {
        noAsyncRegister:
          'Disallowing async register functions in modules to prevent unexpected startup failures or timeouts.',
        noAsyncProviderFactory:
          'Disallowing async useFactory in module providers to prevent unexpected startup failures or timeouts.',
      },
    },
    schema: [],
    create: function (context) {
      return {
        "MethodDefinition[static=true][key.name='register'][value.async=true]": (
          node,
        ) => {
          context.report({
            node,
            messageId: 'noAsyncRegister',
          })
        },
        "ObjectExpression[properties.length=2] > Property[key.name='provide'] + Property[key.name='useFactory'][value.async=true]": (
          node,
        ) => {
          context.report({
            node,
            messageId: 'noAsyncProviderFactory',
          })
        },
      }
    },
  },
}
