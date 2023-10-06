'use strict'

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert(
        'user_profile',
        [
          {
            id: 'ec23d2ff-4798-43eb-b487-c0c37c2778b1',
            national_id: '2222222229',
            mobile_phone_number: '5555555',
            locale: 'en',
          },
        ],
        {
          transaction,
        },
      )
    } catch (err) {
      console.log(err)
      await transaction.rollback()
      throw err
    }

    await transaction.commit()
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user_profile', null, {})
  },
}
