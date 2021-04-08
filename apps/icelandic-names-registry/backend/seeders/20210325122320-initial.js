'use strict'

const data = require('../data')

const remapped = data.map((x) => {
  if (x.visible === 1) {
    x.visible = true
  }

  Object.keys(x).map((k) => {
    if (x[k] === 'NULL' || x[k].trim() === '') {
      // reset empty values to null
      x[k] = null
    }
  })

  // make db create id for record
  delete x.id
  return x
})

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.bulkInsert('icelandic_names', remapped, {})
  },
  down: (queryInterface, _) => {
    return queryInterface.bulkDelete('icelandic_names', null, {})
  },
}
