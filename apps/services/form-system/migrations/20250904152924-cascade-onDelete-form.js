'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing foreign key constraint on application.form_id
    await queryInterface.removeConstraint(
      'application',
      'application_form_id_fkey',
    )
    // Add the foreign key constraint with ON DELETE CASCADE
    await queryInterface.addConstraint('application', {
      fields: ['form_id'],
      type: 'foreign key',
      name: 'application_form_id_fkey',
      references: {
        table: 'form',
        field: 'id',
      },
      onDelete: 'CASCADE',
    })

    // Remove the existing foreign key constraint on value.application_id
    await queryInterface.removeConstraint('value', 'value_application_id_fkey')
    // Add the foreign key constraint with ON DELETE CASCADE
    await queryInterface.addConstraint('value', {
      fields: ['application_id'],
      type: 'foreign key',
      name: 'value_application_id_fkey',
      references: {
        table: 'application',
        field: 'id',
      },
      onDelete: 'CASCADE',
    })
  },

  async down(queryInterface, Sequelize) {
    // Remove the CASCADE constraint from application.form_id
    await queryInterface.removeConstraint(
      'application',
      'application_form_id_fkey',
    )
    // Restore the original constraint (no cascade)
    await queryInterface.addConstraint('application', {
      fields: ['form_id'],
      type: 'foreign key',
      name: 'application_form_id_fkey',
      references: {
        table: 'form',
        field: 'id',
      },
      onDelete: 'RESTRICT',
    })

    // Remove the CASCADE constraint from value.application_id
    await queryInterface.removeConstraint('value', 'value_application_id_fkey')
    // Restore the original constraint (no cascade)
    await queryInterface.addConstraint('value', {
      fields: ['application_id'],
      type: 'foreign key',
      name: 'value_application_id_fkey',
      references: {
        table: 'application',
        field: 'id',
      },
      onDelete: 'RESTRICT',
    })
  },
}
