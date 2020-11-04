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
          recycling_partner_id: '8888888888',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'mhs-583',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: '9999999999',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'aes-135',
          request_type: 'xxxxxxx',
          name_of_requestor: 'xxxxxxx',
          recycling_partner_id: null,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'FZG90',
          request_type: 'pendingVehicle',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-05-08 04:05:06',
        },
        {
          vehicle_id: 'aes-135',
          request_type: 'pendingVehicle',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-10-18 04:05:06',
        },
        {
          vehicle_id: 'aes-135',
          request_type: 'handOver',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-11-10 04:05:06',
        },
        {
          vehicle_id: 'ftm-522',
          request_type: 'pendingVehicle',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-11-08 04:05:06',
        },
        {
          vehicle_id: 'HRX53',
          request_type: 'pendingVehicle',
          name_of_requestor: 'xxxxxxx',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-11-08 04:05:06',
        },
        {
          vehicle_id: 'FZG90',
          request_type: 'handOver',
          name_of_requestor: 'xxxxxxx',
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
