'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application_children',
          'lives_with_applicant',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application_children',
          'lives_with_both_parents',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'application_children',
          'lives_with_applicant',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'application_children',
          'lives_with_both_parents',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
