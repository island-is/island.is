'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        // Add the new column
        queryInterface.addColumn('applications', 'applied', {
          type: Sequelize.DATE,
          allowNull: true,
        }),
        // Update the applied column with the createdAt date
        queryInterface.sequelize.query(`
          UPDATE "applications"
          SET "applied" = "created"
        `),
        // Change the column to not allow null values if necessary
        queryInterface.changeColumn('applications', 'applied', {
          type: Sequelize.DATE,
          allowNull: false,
        }),
      ]),
    )
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
