'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'userprofile',
      [
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c37c27-178b1',
          nationalId: '010291-1519',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c37dee-178b1',
          nationalId: '250891-1489',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-4798-43ee-e407-d0c37c27-178b1',
          nationalId: '110185-1549',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2gg-4798-43ee-e487-d0c37c27-178b1',
          nationalId: '020684-1439',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-5778-43ee-e487-d0c37c27-178b1',
          nationalId: '140177-1489',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c3dd27-23eb1',
          nationalId: '030573-1539',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-4798-43ee-e500-d0c37c27-178b1',
          nationalId: '010256-1439',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c37c27-178cc',
          nationalId: '010663-1489',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-e9c37e27-178cc',
          nationalId: '061058-1419',
          mobilePhoneNumber: '555-5555',
          locale: 'en',
          email: 'email@email.com',
          documentNotifications: true,
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('userprofile', null, {})
  },
}
