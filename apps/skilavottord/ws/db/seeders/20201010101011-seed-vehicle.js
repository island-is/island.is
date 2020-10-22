'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'vehicle',
      [
        {
          vehicle_id: 'jfk-433',
          owner_national_id: '3333333333',
          vehicle_type: 'Volvo c40',
          vehicle_color: 'white',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'ftm-522',
          owner_national_id: '1111111111',
          vehicle_type: 'Ford focus',
          vehicle_color: 'blue',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'mhs-583',
          owner_national_id: '1111111111',
          vehicle_type: 'Tesla m3',
          vehicle_color: 'Red',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'aes-135',
          owner_national_id: '2222222222',
          vehicle_type: 'wv id-3',
          vehicle_color: 'white',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vehicle', null, {})
  },
}
