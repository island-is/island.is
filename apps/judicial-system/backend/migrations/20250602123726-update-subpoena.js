'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'subpoena',
        'type',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
        UPDATE subpoena
        SET type = defendant.subpoena_type
        FROM defendant
        WHERE subpoena.defendant_id = defendant.id
          AND defendant.subpoena_type IS NOT NULL
        `,
        { transaction },
      )
    })
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('subpoena', 'type', {
        transaction,
      }),
    )
  },
}
