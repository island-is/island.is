'use strict'

const { getGenericVoterRegistry } = require('../test/seedHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const voterRegistry = [
      {
        ...getGenericVoterRegistry(),
        national_id: '0101302989',
        version: 1,
      },
      {
        ...getGenericVoterRegistry(),
        national_id: '0101303019',
        version: 1,
      },
      {
        ...getGenericVoterRegistry(),
        national_id: '0101303369',
        version: 1,
      },
      {
        ...getGenericVoterRegistry(),
        national_id: '0101302989',
        version: 2,
      },
      {
        ...getGenericVoterRegistry(),
        national_id: '0101302989',
        version: 3,
      },
      {
        ...getGenericVoterRegistry(),
        national_id: '0101303019',
        version: 3,
      },
      {
        ...getGenericVoterRegistry(),
        national_id: '0101305069',
        version: 3,
      },
      {
        national_id: '2605923199',
        region_number: 2,
        region_name: 'Norðausturkjördæmi',
        version: 3,
        created: new Date(),
        modified: new Date(),
      }
    ]

    await queryInterface.bulkInsert('voter_registry', voterRegistry)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('voter_registry')
  },
}
