'use strict'

const generateNumber = (index) => {
  if (index < 10) {
    return '00' + index.toString()
  } else if (index < 100) {
    return '0' + index.toString()
  }
  return index
}

const generateVehicles = () => {
  const cars = []
  for (let index = 0; index < 666; index++) {
    cars.push({
      vehicle_id: 'AA' + generateNumber(index),
      owner_national_id: '3333333333',
      vehicle_type: 'Audi 80',
      vehicle_color: 'red',
      newreg_date: '2020-09-08 04:05:06',
      created_at: '2020-09-08 04:05:06',
      updated_at: '2020-09-08 04:05:06',
    })
  }
  return cars
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'vehicle',
      [
        {
          vehicle_id: 'LT579',
          owner_national_id: '3333333333',
          vehicle_type: 'Audi 80',
          vehicle_color: 'red',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'FT522',
          owner_national_id: '1111111111',
          vehicle_type: 'Ford focus',
          vehicle_color: 'blue',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'MHS83',
          owner_national_id: '1111111111',
          vehicle_type: 'Tesla m3',
          vehicle_color: 'Red',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          vehicle_id: 'FZG90',
          owner_national_id: '2222222222',
          vehicle_type: 'Benz',
          vehicle_color: 'white',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-10-08 04:05:06',
        },
        {
          vehicle_id: 'HRX53',
          owner_national_id: '2222222222',
          vehicle_type: 'Honda',
          vehicle_color: 'Black',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-10-08 04:05:06',
        },
        {
          vehicle_id: 'AE135',
          owner_national_id: '2222222222',
          vehicle_type: 'wv id-3',
          vehicle_color: 'white',
          newreg_date: '2020-09-08 04:05:06',
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        ...generateVehicles(),
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('vehicle', null, {})
  },
}
