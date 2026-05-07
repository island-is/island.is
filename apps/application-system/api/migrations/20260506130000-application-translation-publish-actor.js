'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'application_translation_publish',
      'actor_national_id',
      { type: Sequelize.STRING(20), allowNull: true },
    )
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'application_translation_publish',
      'actor_national_id',
    )
  },
}
