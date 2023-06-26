'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'institution',
          'national_id',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        )
        .then(() =>
          Promise.all([
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '6808140740' },
              {
                id: '1c45b4c5-e5d3-45ba-96f8-219568982268',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '5310062320' },
              {
                id: '53581d7b-0591-45e5-9cbe-c96b2f82da85',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '6708140410' },
              {
                id: 'a4b204f3-b072-41b6-853c-42ec4b263bd6',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '6309142210' },
              {
                id: '26136a67-c3d6-4b73-82e2-3265669a36d3',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '5011060540' },
              {
                id: '0b4e39bb-2177-4dfc-bb7b-7bb6bc42a661',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '4411140360' },
              {
                id: '34d35fa7-2805-4488-84f6-d22c6bae3dd3',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '4412141110' },
              {
                id: '03e48408-342b-4c25-b556-d82a5d9edfbe',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '4411151480' },
              {
                id: 'fbbe0ebd-33f1-4a8f-84ba-8e4b8e8b16b1',
              },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              // eslint-disable-next-line local-rules/disallow-kennitalas
              { national_id: '5301750229' },
              {
                id: '8f9e2f6d-6a00-4a5e-b39b-95fd110d762e',
              },
              { transaction },
            ),
            queryInterface.bulkInsert(
              'institution',
              [
                {
                  id: '0be621ec-c063-4df3-ab15-61f6e421ed7c',
                  name: 'Lögreglustjórinn á Norðurlandi vestra',
                  type: 'PROSECUTORS_OFFICE',
                  active: false,
                  default_court_id: '7299ab8f-2fcc-40be-8194-8c2f749b4791',
                  // eslint-disable-next-line local-rules/disallow-kennitalas
                  national_id: '6708140330',
                },
                {
                  id: 'affee2cd-5519-450e-b11c-bdd61229e1ad',
                  name: 'Lögreglustjórinn á Vestfjörðum',
                  type: 'PROSECUTORS_OFFICE',
                  active: false,
                  default_court_id: 'e997eb13-9963-46ef-b1d8-6b806a1965eb',
                  // eslint-disable-next-line local-rules/disallow-kennitalas
                  national_id: '4812140760',
                },
              ],
              { transaction },
            ),
          ]),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('institution', 'national_id', {
          transaction,
        }),
        queryInterface.bulkDelete(
          'institution',
          {
            id: [
              '0be621ec-c063-4df3-ab15-61f6e421ed7c',
              'affee2cd-5519-450e-b11c-bdd61229e1ad',
            ],
          },
          { transaction },
        ),
      ]),
    )
  },
}
