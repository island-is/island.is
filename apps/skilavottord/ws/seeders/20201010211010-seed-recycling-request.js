'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'recycling_request',
      [
        {
          id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'VM006',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: '8888888888',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          id: 'b1fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'LT579',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: '9999999999',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          id: 'c1fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'AE135',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          id: 'a2fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'FZG90',
          request_type: 'pendingRecycle',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-05-08 04:05:06',
        },
        {
          id: 'a3fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'AE135',
          request_type: 'pendingRecycle',
          recycling_partner_id: null,
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-10-18 04:05:06',
        },
        {
          id: 'a4fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'AE135',
          request_type: 'handOver',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-11-10 04:05:06',
        },
        {
          id: 'a5fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'FT522',
          request_type: 'pendingRecycle',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-11-08 04:05:06',
        },
        {
          id: 'a6fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'HRX53',
          request_type: 'pendingRecycle',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-11-08 04:05:06',
        },
        {
          id: 'a7fd62db-18a6-4741-88eb-a7b7a7e05833',
          vehicle_id: 'FZG90',
          request_type: 'handOver',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-10-08 04:05:06',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('recycling_request', null, {})
  },
}
