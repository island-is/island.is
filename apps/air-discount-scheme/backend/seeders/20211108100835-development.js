'use strict'
const faker = require('faker')

const getRandomFlightLeg = (flightId, flightDate) => {
  const randomPrice = 10000 + (0.5 - Math.random()) * 10000
  return {
    id: faker.datatype.uuid(),
    flight_id: flightId,
    origin: [65, 65, 65]
      .map((i) => String.fromCharCode(i + Math.floor(Math.random() * 26)))
      .join(''),
    destination: [65, 65, 65]
      .map((i) => String.fromCharCode(i + Math.floor(Math.random() * 26)))
      .join(''),
    original_price: randomPrice,
    discount_price: 0.6 * randomPrice,
    date: flightDate,
    created: flightDate,
    modified: flightDate,
    financial_state: 'AWAITING_DEBIT',
    airline: ['ernir', 'norlandair', 'icelandair'][
      Math.floor(Math.random() * 3)
    ],
    cooperation: null,
    financial_state_updated: flightDate,
    is_connecting_flight: false,
  }
}

const getRandomFlight = (nationalId) => {
  // Random time, max 30 days in the past
  const randomDate = new Date(
    Date.now() - Math.ceil(Math.random() * 2592000000),
  ).toISOString()
  return {
    id: faker.datatype.uuid(),
    national_id: nationalId,
    created: randomDate,
    modified: randomDate,
    booking_date: randomDate,
    user_info: JSON.stringify({
      age: faker.datatype.number(99),
      gender: faker.datatype.boolean() ? 'kk' : 'kvk',
      postalCode: '600',
    }),
    connectable: faker.datatype.boolean(),
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const flights = []
    const flight_legs = []
    for (let i = 0; i < 100; i++) {
      const flight = getRandomFlight(faker.phone.phoneNumber('##########'))
      flights.push(flight)
      for (let j = 0; j < faker.datatype.number(2); j++) {
        flight_legs.push(getRandomFlightLeg(flight.id, flight.created))
      }
    }
    await queryInterface.bulkInsert('flight', flights)
    await queryInterface.bulkInsert('flight_leg', flight_legs)
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('flight'),
      queryInterface.bulkDelete('flight_leg'),
    ])
  },
}
