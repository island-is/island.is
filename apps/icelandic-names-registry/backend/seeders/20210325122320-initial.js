'use strict'

const data = require('../data')

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.bulkInsert('icelandic_names', data, {})
  },
  down: (queryInterface, _) => {
    return queryInterface.bulkDelete('icelandic_names', null, {})
  },
}
