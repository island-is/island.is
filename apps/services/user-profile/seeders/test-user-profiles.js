'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'user_profile',
      [
        {
          id: 'ec23d2ff-4798-43eb-b487-c0c37c2778b1',
          national_id: '2222222229',
          mobile_phone_number: '2222229',
          locale: 'en',
          email: 'email@email.com',
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user_profile', null, {})
  },
}
