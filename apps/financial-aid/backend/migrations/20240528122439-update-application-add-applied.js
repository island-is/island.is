'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add the new column
      await queryInterface.addColumn(
        'applications',
        'applied',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction: t },
      )

      // Update the applied column with the createdAt date
      await queryInterface.sequelize.query(
        `
          UPDATE applications
          SET applied = created;
        `,
        { transaction: t },
      )

      // Change the column to not allow null values if necessary
      await queryInterface.changeColumn(
        'applications',
        'applied',
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('applications', 'applied', {
          transaction: t,
        }),
      ]),
    )
  },
}
