'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .bulkUpdate(
          'institution',
          { active: true },
          {
            id: [
              '0be621ec-c063-4df3-ab15-61f6e421ed7c', // Lögreglustjórinn á Norðurlandi Vestra]
              '7299ab8f-2fcc-40be-8194-8c2f749b4791', // Héraðsdómur Norðurlands Vestra
            ],
          },
          { transaction },
        )
        .then(() =>
          Promise.all([
            queryInterface.bulkUpdate(
              'institution',
              { police_case_number_prefix: '314' },
              { id: 'affee2cd-5519-450e-b11c-bdd61229e1ad' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              { police_case_number_prefix: '315' },
              { id: '0be621ec-c063-4df3-ab15-61f6e421ed7c' },
              { transaction },
            ),
          ]),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'institution',
        { active: false },
        {
          id: [
            '0be621ec-c063-4df3-ab15-61f6e421ed7c', // Lögreglustjórinn á Norðurlandi Vestra]
            '7299ab8f-2fcc-40be-8194-8c2f749b4791', // Héraðsdómur Norðurlands Vestra
          ],
        },
        { transaction },
      ),
    )
  },
}
