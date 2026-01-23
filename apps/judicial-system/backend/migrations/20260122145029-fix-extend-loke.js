'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'case',
        {
          police_defendant_national_id: Sequelize.literal(`(
                SELECT d.national_id
                FROM "defendant" d
                WHERE d.case_id = "case".id
                ORDER BY d.created ASC
                LIMIT 1
              )`),
        },
        { origin: 'LOKE', police_defendant_national_id: null },
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
