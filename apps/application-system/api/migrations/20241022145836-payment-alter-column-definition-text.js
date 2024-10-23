'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('payment', 'definition', {
      type: Sequelize.TEXT,
      allowNull: true, // Keep the same nullability as before
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('payment', 'definition', {
      type: Sequelize.STRING,
      allowNull: true, // Revert to the original type and nullability
    })
  },
}
