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
}
