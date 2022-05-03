'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('case', 'accused_plea_announcement', {
          transaction,
        }),
        queryInterface.removeColumn('case', 'is_accused_rights_hidden', {
          transaction,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'accused_plea_announcement',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'case',
          'is_accused_rights_hidden',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },
}
