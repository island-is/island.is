'use strict'

const findByAuthSeeds = require('../src/app/modules/voterRegistry/e2e/findByAuth/seed')
const findByNationalIdSeeds = require('../src/app/modules/voterRegistry/e2e/findByNationalId/seed')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const voterRegistry = [
      ...findByAuthSeeds.voterRegistry,
      ...findByNationalIdSeeds.voterRegistry,
    ]

    await queryInterface.bulkInsert('voter_registry', voterRegistry)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('voter_registry')
  },
}
