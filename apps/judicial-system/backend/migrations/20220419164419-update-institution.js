'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'institution',
          { active: true },
          {
            id: ['c98547fd-cc63-408c-815a-9c5d33ee5ba0'],
          },
          { transaction: t },
        ),
        queryInterface.bulkInsert(
          'institution',
          [
            {
              id: 'a4b204f3-b072-41b6-853c-42ec4b263bd6',
              name: 'Lögreglustjórinn á Norðurlandi eystra',
              type: 'PROSECUTORS_OFFICE',
              active: true,
            },
          ],
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'institution',
          { active: false },
          {
            id: ['c98547fd-cc63-408c-815a-9c5d33ee5ba0'],
          },
          { transaction: t },
        ),
        queryInterface.bulkDelete(
          'institution',
          {
            id: ['a4b204f3-b072-41b6-853c-42ec4b263bd6'],
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
