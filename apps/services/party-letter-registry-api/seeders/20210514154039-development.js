'use strict'

const { getGenericPartyLetterRegistry } = require('../test/seedHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const partyLetterRegistry = [
      { ...getGenericPartyLetterRegistry(), party_letter: 'A' },
      { ...getGenericPartyLetterRegistry(), party_letter: 'B' },
      { ...getGenericPartyLetterRegistry(), party_letter: 'C' },
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
