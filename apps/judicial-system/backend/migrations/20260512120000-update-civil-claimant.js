'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'civil_claimant',
          'police_case_numbers',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'civil_claimant',
          'defendant_ids',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('civil_claimant', 'police_case_numbers', {
          transaction,
        }),
        queryInterface.removeColumn('civil_claimant', 'defendant_ids', {
          transaction,
        }),
      ]),
    )
  },
}
