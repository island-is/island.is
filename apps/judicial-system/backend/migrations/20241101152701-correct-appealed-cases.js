'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'case',
          { prosecutor_postponed_appeal_date: null },
          {
            id: [
              '7ee802fa-cfcd-48e6-b198-ea6c53a2ddd0',
              '133b1a36-e4c3-42d6-8293-0bd57bddc40b',
              '0e1dd971-8958-4e2e-9c81-940c2bd10909',
            ],
          },
          { transaction },
        ),
        queryInterface.bulkUpdate(
          'case',
          {
            accused_postponed_appeal_date: null,
          },
          { id: 'fa4a89b7-5617-44fd-9691-c6cb6f8d27c5' },
          { transaction },
        ),
        queryInterface.bulkUpdate(
          'case',
          {
            prosecutor_postponed_appeal_date: null,
            accused_postponed_appeal_date: null,
          },
          {
            id: ['798e8e75-e853-48b3-a15d-1fbfcd018f98'],
          },
          { transaction },
        ),
        queryInterface.bulkUpdate(
          'case',
          {
            appeal_state: null,
            prosecutor_postponed_appeal_date: null,
            accused_postponed_appeal_date: null,
          },
          {
            id: ['d909a866-7ed0-45ed-86c1-2445a7475e4e'],
          },
          { transaction },
        ),
      ]),
    )
  },

  async down() {
    return
  },
}
