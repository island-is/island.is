'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'userprofile',
      [
        {
          id: 'ec23d2ff-4798-43eb-b487-c0c37c2778b2',
          nationalId: '123456-7890',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('userprofile', null, {})
  },
}
