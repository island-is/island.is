'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'vehicle_owner',
      [
        {
          national_id: '1111111111',
          personname: 'Óðinn Jónsson',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          national_id: '2222222222',
          personname: 'Bogi Ágústsson',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-10-08 04:05:06',
        },
        {
          national_id: '3333333333',
          personname: 'Jóhanna Vigdís',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vehicle_owner', null, {})
  },
}
