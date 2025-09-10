'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Flip all values (true -> false, false -> true)
    await queryInterface.sequelize.query(`
      UPDATE "form"
      SET stop_progress_on_validating_screen = NOT stop_progress_on_validating_screen
    `)

    // 2. Rename the column
    await queryInterface.renameColumn(
      'form',
      'stop_progress_on_validating_screen',
      'allow_proceed_on_validation_fail',
    )

    // 3. Set default value to false
    await queryInterface.changeColumn(
      'form',
      'allow_proceed_on_validation_fail',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    )
  },

  async down(queryInterface, Sequelize) {
    // 1. Rename the column back
    await queryInterface.renameColumn(
      'form',
      'allow_proceed_on_validation_fail',
      'stop_progress_on_validating_screen',
    )

    // 2. Flip all values back
    await queryInterface.sequelize.query(`
      UPDATE "form"
      SET stop_progress_on_validating_screen = NOT stop_progress_on_validating_screen
    `)

    // 3. Remove default value
    await queryInterface.changeColumn(
      'form',
      'stop_progress_on_validating_screen',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    )
  },
}
