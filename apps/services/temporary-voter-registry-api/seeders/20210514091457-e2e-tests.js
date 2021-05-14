'use strict'

const findOneSeeds = require('../src/app/modules/voterRegistry/e2e/findOne/seed')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const voterRegistry = [...findOneSeeds.voterRegistry]

    await queryInterface.bulkInsert('voter_registry', voterRegistry)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('voter_registry')
  },
}
