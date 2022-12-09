'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.changeColumn(
          'case_file',
          'police_case_number',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'case_file',
          'user_generated_filename',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.changeColumn(
          'case_file',
          'police_case_number',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'case_file',
          'user_generated_filename',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },
}
