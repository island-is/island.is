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
          partner_id: '',
          // created_at: '2020-09-08 04:05:06',
          // updated_at: '2020-09-08 04:05:06',
        },
        {
          national_id: '7777777777',
          name: 'Gunnar Gunnarsson',
          role: 'recyclingCompany',
          partner_id: '',
          // created_at: '2021-09-08 04:05:06',
          // updated_at: '2021-09-08 04:05:06',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('access_control', null, {})
  },
}
