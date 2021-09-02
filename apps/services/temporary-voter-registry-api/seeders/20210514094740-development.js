'use strict'

const { getGenericVoterRegistry } = require('../test/seedHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakeNationalIds = [
      '0101302129', // Gervimaður Noregur
      '0101302209', // Gervimaður Finnland
      '0101302399', // Gervimaður Færeyjar
      '0101302479', // Gervimaður Danmörk
      '0101302559', // Gervimaður Svíþjóð
      '0101302639', // Gervimaður Grænland
      '0101302719', // Gervimaður Evrópa
      '0101302989', // Gervimaður Ameríka
      '0101303019', // Gervimaður Afríka
      '0101303369', // Gervimaður Asía
    ]

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
        national_id: '0101302399',
        region_number: 2,
        region_name: 'Norðausturkjördæmi',
        version: 3,
        created: new Date(),
        modified: new Date(),
      }
    ]

    for(const nid of fakeNationalIds) {
      voterRegistry.push({
        national_id: nid,
        region_number: 2,
        region_name: 'Norðausturkjördæmi',
        version: 3,
        created: new Date(),
        modified: new Date(),
      })
    }

    await queryInterface.bulkInsert('voter_registry', voterRegistry)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('voter_registry')
  },
}
