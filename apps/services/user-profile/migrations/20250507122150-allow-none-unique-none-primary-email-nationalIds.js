'use strict'

module.exports = {
  async up(queryInterface) {
    // Remove the existing constraint that prevents multiple emails with same national_id
    await queryInterface.removeConstraint(
      'emails',
      'emails_national_id_primary_unique',
    )

    // Create a partial unique index that only applies when primary is true
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX emails_national_id_primary_unique 
      ON emails (national_id) 
      WHERE "primary" = true
    `)
  },

  async down(queryInterface) {
    // Remove the partial unique index
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS emails_national_id_primary_unique',
    )

    // Restore the original constraint
    await queryInterface.addConstraint('emails', {
      fields: ['national_id', 'primary'],
      type: 'unique',
      name: 'emails_national_id_primary_unique',
    })
  },
}
