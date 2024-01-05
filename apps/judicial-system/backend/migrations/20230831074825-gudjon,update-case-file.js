'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case_file',
        'police_file_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case_file', 'police_file_id', {
        transaction,
      }),
    )
  },
}
