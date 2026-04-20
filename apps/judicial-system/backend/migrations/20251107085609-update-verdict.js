'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('verdict', 'legal_paper_request_date', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'verdict',
          'legal_paper_request_date',
          {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
