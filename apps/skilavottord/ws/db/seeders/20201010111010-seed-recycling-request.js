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
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'mhs-583',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'aes-135',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('recycling_request', null, {})
  },
}
