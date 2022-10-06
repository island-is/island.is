'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'institution',
          { active: true },
          {
            id: ['73ef0f01-7ae6-477c-af4a-9e86c2bc3440'],
          },
          { transaction: t },
        ),
        queryInterface.bulkUpdate(
          'institution',
          { default_court_id: 'f350f77a-85b9-4267-a7e9-f3f29873486c', police_case_number_prefix: '319' },
          { id: ['03e48408-342b-4c25-b556-d82a5d9edfbe'] },
          { transaction: t },
        ),
        queryInterface.bulkInsert(
          'institution',
          [
            {
              id: '1c45b4c5-e5d3-45ba-96f8-219568982268',
              name: 'Lögreglustjórinn á Austurlandi',
              type: 'PROSECUTORS_OFFICE',
              active: true,
              default_court_id: '73ef0f01-7ae6-477c-af4a-9e86c2bc3440',
              police_case_number_prefix: '317',
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
            id: ['73ef0f01-7ae6-477c-af4a-9e86c2bc3440'],
          },
          { transaction: t },
        ),
        queryInterface.bulkDelete(
          'institution',
          {
            id: ['1c45b4c5-e5d3-45ba-96f8-219568982268'],
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
