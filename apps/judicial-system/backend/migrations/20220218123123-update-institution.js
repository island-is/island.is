'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'institution',
          { active: true },
          {
            id: ['9acb7d8e-426c-45a3-b3ef-5657bab629a3'],
          },
          { transaction: t },
        ),
        queryInterface.bulkInsert(
          'institution',
          [
            {
              id: 'f350f77a-85b9-4267-a7e9-f3f29873486c',
              name: 'Héraðsdómur Suðurlands',
              type: 'COURT',
              active: true,
            },
            {
              id: '26136a67-c3d6-4b73-82e2-3265669a36d3',
              name: 'Lögreglustjórinn á Suðurlandi',
              type: 'PROSECUTORS_OFFICE',
              active: true,
            },
            {
              id: '03e48408-342b-4c25-b556-d82a5d9edfbe',
              name: 'Lögreglustjórinn í Vestmannaeyjum',
              type: 'PROSECUTORS_OFFICE',
              active: true,
            },
            {
              id: '34d35fa7-2805-4488-84f6-d22c6bae3dd3',
              name: 'Lögreglustjórinn á Vesturlandi',
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
            id: ['9acb7d8e-426c-45a3-b3ef-5657bab629a3'],
          },
          { transaction: t },
        ),
        queryInterface.bulkDelete(
          'institution',
          {
            id: [
              'f350f77a-85b9-4267-a7e9-f3f29873486c',
              '26136a67-c3d6-4b73-82e2-3265669a36d3',
              '03e48408-342b-4c25-b556-d82a5d9edfbe',
              '34d35fa7-2805-4488-84f6-d22c6bae3dd3',
            ],
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
