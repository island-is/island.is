'use strict'

module.exports = {
  up: (queryInterface) => {
    try {
      return queryInterface.bulkInsert(
        'user_profile',
        [
          {
            id: 'ec23d2ff-4798-43eb-b487-c0c37c2778b2',
            national_id: '0101302399',
            mobile_phone_number: '5555556',
            locale: 'en',
            email: 'email2@email2.com',
          },
        ],
        {},
      )
    } catch (err) {
      console.log(err)
    }
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user_profile', null, {})
  },
}
