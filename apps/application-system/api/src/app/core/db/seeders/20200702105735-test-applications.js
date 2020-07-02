'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'Applications',
      [
        {
          id: 'ec23d2ff-4798-43eb-b487-c0c37c2778b2',
          applicant: '123456-7890',
          state: 'PENDING',
          attatchments: ['https://google.com', 'https://aranja.com'],
          typeId: 'example',
          answers: JSON.stringify({
            question1: 'some answer',
            question2: 'another answer',
          }),
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Applications', null, {})
  },
}
