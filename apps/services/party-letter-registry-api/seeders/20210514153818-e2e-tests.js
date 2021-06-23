'use strict'

const createPartyLetterRegistry = require('../src/app/modules/partyLetterRegistry/e2e/create/seed.js')
const findByOwnerPartyLetterRegistry = require('../src/app/modules/partyLetterRegistry/e2e/findByOwner/seed.js')
const findByManagerPartyLetterRegistry = require('../src/app/modules/partyLetterRegistry/e2e/findByManager/seed.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const partyLetterRegistry = [
      ...createPartyLetterRegistry.partyLetterRegistry,
      ...findByOwnerPartyLetterRegistry.partyLetterRegistry,
      ...findByManagerPartyLetterRegistry.partyLetterRegistry,
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
