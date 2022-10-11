'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'case_file',
          'police_case_number',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          {
            transaction,
          },
        ),
        queryInterface.addColumn(
          'case_file',
          'user_generated_filename',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          {
            transaction,
          },
        ),
        queryInterface.addColumn(
          'case_file',
          'chapter',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          {
            transaction,
          },
        ),
        queryInterface.addColumn(
          'case_file',
          'order_within_chapter',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          {
            transaction,
          },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('case_file', 'police_case_number', {
          transaction,
        }),
        queryInterface.removeColumn('case_file', 'user_generated_filename', {
          transaction,
        }),
        queryInterface.removeColumn('case_file', 'chapter', {
          transaction,
        }),
        queryInterface.removeColumn('case_file', 'order_within_filename', {
          transaction,
        }),
      ]),
    )
  },
}
