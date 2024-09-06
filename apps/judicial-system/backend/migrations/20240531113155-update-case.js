'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'case',
          'state',
          { type: Sequelize.STRING, allowNull: false },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query('DROP TYPE "enum_case_state"', {
            transaction,
          }),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'case',
          'state',
          {
            type: Sequelize.ENUM(
              'NEW',
              'DRAFT',
              'WAITING_FOR_CONFIRMATION',
              'SUBMITTED',
              'RECEIVED',
              'MAIN_HEARING',
              'COMPLETED',
              'ACCEPTED',
              'REJECTED',
              'DISMISSED',
              'DELETED',
            ),
            allowNull: false,
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE "case" ALTER COLUMN state SET DEFAULT 'NEW'`,
            { transaction },
          ),
        ),
    )
  },
}
