'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case',
          'police_defendant_national_id',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        )
        .then(() =>
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
            { origin: 'LOKE' },
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case', 'police_defendant_national_id', {
        transaction,
      }),
    )
  },
}
