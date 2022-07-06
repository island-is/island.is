'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'access_control',
      [
        {
          national_id: '8888888888',
          name: 'Finnur Finnsson',
          role: 'developer',
          partner_id: '9999999999',
        },
        {
          national_id: '7777777777',
          name: 'Gunnar Gunnarsson',
          role: 'recyclingCompany',
          partner_id: '8888888888',
        },
        {
          national_id: '0301665909',
          name: 'Sigurgeir Gudmundsson',
          role: 'developer',
          partner_id: '9999999999',
          email: 'essgje@island.is',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('access_control', null, {})
  },
}
