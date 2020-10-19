'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'vehicle_owner',
      [
        {
          national_id: '1111111111',
          personname: 'Óðin Jónsson',
        },
        {
          national_id: '2222222222',
          personname: 'Bogi Ágústsson',
        },
        {
          national_id: '3333333333',
          personname: 'Jóhanna Vigdís',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vehicle_owner', null, {})
  },
}
