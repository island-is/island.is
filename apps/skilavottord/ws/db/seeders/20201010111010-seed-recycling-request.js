'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'recycling_request',
      [
        {
          vehicle_id: 'ftm-522',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
        },
        {
          vehicle_id: 'mhs-583',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
        },
        {
          vehicle_id: 'aes-135',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('recycling_request', null, {})
  },
}
