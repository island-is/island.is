'use strict'

const { getGenericPartyLetterRegistry } = require('../test/seedHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const partyLetterRegistry = [
      getGenericPartyLetterRegistry(),
      getGenericPartyLetterRegistry(),
      getGenericPartyLetterRegistry(),
    ]

    await queryInterface.bulkInsert(
      'party_letter_registry',
      partyLetterRegistry,
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('party_letter_registry')
  },
}
