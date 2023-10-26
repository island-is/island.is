'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'user_profile',
      [
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c37c27-178b1',
          national_Id: '0102911519',
          mobile_phone_number: '555-5555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c37dee-178b1',
          national_id: '2508911489',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-4798-43ee-e407-d0c37c27-178b1',
          national_id: '1101851549',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2gg-4798-43ee-e487-d0c37c27-178b1',
          national_id: '0206841439',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-5778-43ee-e487-d0c37c27-178b1',
          national_id: '1401771489',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c3dd27-23eb1',
          national_id: '0305731539',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-4798-43ee-e500-d0c37c27-178b1',
          national_id: '0102561439',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-d0c37c27-178cc',
          national_id: '0106631489',
          mobile_phone_number: '5555555',
          locale: 'en',
          email: 'email@email.com',
        },
        {
          id: 'fc24d2ff-4798-43ee-e487-e9c37e27-178cc',
          national_id: '0610581419',
          mobile_phone_number: '5555555',
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
