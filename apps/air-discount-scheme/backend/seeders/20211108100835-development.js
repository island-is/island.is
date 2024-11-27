'use strict'
const { faker } = require('@faker-js/faker')

// Good to have test users accumulate more than the statistically
// likely singular flight leg.
const specific_test_users = ['0101302399', '2222222229']

const pairings = [
  [
    ['REK', 'AEY'],
    ['REK', 'AEY'],
    ['AEY', 'REK'],
    ['AEY', 'REK'],
  ],
  [
    ['AEY', 'REK'],
    ['AEY', 'THO'],
    ['REK', 'AEY'],
    ['THO', 'AEY'],
  ],
]

const getRandomFlightLeg = (flightId, flightDate, pairing) => {
  const randomPrice = 10000 + (0.5 - Math.random()) * 10000
  return {
    id: faker.string.uuid(),
    flight_id: flightId,
    origin: pairing[0],
    destination: pairing[1],
    original_price: randomPrice,
    discount_price: 0.6 * randomPrice,
    date: flightDate,
    created: flightDate,
    modified: flightDate,
    financial_state: 'AWAITING_DEBIT',
    airline: faker.helpers.arrayElement([
      'ernir',
      'norlandair',
      'icelandair',
      'myflug',
    ]),
    cooperation: null,
    financial_state_updated: flightDate,
    is_connecting_flight: pairing[0] === 'THO' || pairing[1] === 'THO',
  }
}

const getRandomFlight = (nationalId) => {
  // Random time, max 1 day into the future
  const randomDate = faker.date
    .soon({ days: 1, refDate: Date.now() })
    .toISOString()
  return {
    id: faker.string.uuid(),
    national_id: nationalId,
    created: randomDate,
    modified: randomDate,
    booking_date: randomDate,
    user_info: JSON.stringify({
      age: faker.number.int(99),
      gender: faker.helpers.arrayElement(['kk', 'kvk', 'x']),
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
      const nationalId =
        i < 4
          ? specific_test_users[0]
          : i < 14
          ? specific_test_users[1]
          : faker.string.numeric(7)
      const pairingLeg = Math.round(Math.random() * (pairings[0].length - 1))
      const flight = getRandomFlight(nationalId)
      flights.push(flight)
      for (let j = 0; j < faker.number.int({ min: 1, max: 2 }); j++) {
        flight_legs.push(
          getRandomFlightLeg(
            flight.id,
            flight.created,
            pairings[j][pairingLeg],
          ),
        )
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
