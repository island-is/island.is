'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'case_file',
          'state',
          { type: Sequelize.STRING, allowNull: false },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query('DROP TYPE "enum_case_file_state"', {
            transaction,
          }),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.changeColumn(
        'case_file',
        'state',
        {
          type: Sequelize.ENUM('STORED_IN_RVG', 'STORED_IN_COURT', 'DELETED'),
          allowNull: false,
        },
        { transaction },
      ),
    )
  },
}
