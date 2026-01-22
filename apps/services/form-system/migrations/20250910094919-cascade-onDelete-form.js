'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing foreign key constraint on form_certification_type.form_id
    await queryInterface.removeConstraint(
      'form_certification_type',
      'form_certification_type_form_id_fkey',
    )
    // Add the foreign key constraint with ON DELETE CASCADE
    await queryInterface.addConstraint('form_certification_type', {
      fields: ['form_id'],
      type: 'foreign key',
      name: 'form_certification_type_form_id_fkey',
      references: {
        table: 'form',
        field: 'id',
      },
      onDelete: 'CASCADE',
    })
  },

  async down(queryInterface, Sequelize) {
    // Remove the CASCADE constraint
    await queryInterface.removeConstraint(
      'form_certification_type',
      'form_certification_type_form_id_fkey',
    )
    // Restore the original constraint (no cascade)
    await queryInterface.addConstraint('form_certification_type', {
      fields: ['form_id'],
      type: 'foreign key',
      name: 'form_certification_type_form_id_fkey',
      references: {
        table: 'form',
        field: 'id',
      },
      onDelete: 'RESTRICT',
    })
  },
}
