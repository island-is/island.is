'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Start a transaction
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // Add a new column for storing temporary data
      await queryInterface.addColumn(
        'program_extra_application_field',
        'temp_options',
        {
          type: Sequelize.JSONB, // Change to JSONB type
          allowNull: true,
        },
        { transaction },
      )

      // Copy data from the 'options' column to the 'temp_options' column
      await queryInterface.sequelize.query(
        'UPDATE program_extra_application_field SET temp_options = CAST(options AS JSONB)',
        { transaction },
      )

      // Remove the 'options' column
      await queryInterface.removeColumn(
        'program_extra_application_field',
        'options',
        { transaction },
      )

      // Rename the 'temp_options' column to 'options'
      await queryInterface.renameColumn(
        'program_extra_application_field',
        'temp_options',
        'options',
        { transaction },
      )

      // Commit the transaction
      await transaction.commit()
    } catch (error) {
      // Rollback the transaction if there's an error
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Start a transaction
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // Add a new column for storing temporary data
      await queryInterface.addColumn(
        'program_extra_application_field',
        'temp_options',
        {
          type: Sequelize.TEXT, // Change back to TEXT type
          allowNull: true,
        },
        { transaction },
      )

      // Copy data from the 'options' column to the 'temp_options' column
      await queryInterface.sequelize.query(
        'UPDATE program_extra_application_field SET temp_options = options::TEXT',
        { transaction },
      )

      // Remove the 'options' column
      await queryInterface.removeColumn(
        'program_extra_application_field',
        'options',
        { transaction },
      )

      // Rename the 'temp_options' column to 'options'
      await queryInterface.renameColumn(
        'program_extra_application_field',
        'temp_options',
        'options',
        { transaction },
      )

      // Commit the transaction
      await transaction.commit()
    } catch (error) {
      // Rollback the transaction if there's an error
      await transaction.rollback()
      throw error
    }
  },
}
