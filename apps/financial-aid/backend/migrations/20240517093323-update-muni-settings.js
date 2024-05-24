'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'municipality',
          'children_aid',
          {
            type: Sequelize.ENUM('NotDefined', 'Institution', 'Applicant'),
            allowNull: false,
            defaultValue: 'NotDefined',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('municipality', 'children_aid', {
          transaction: t,
        }),
      ]),
    )
  },
}
