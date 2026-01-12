'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emails', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_status: {
        type: Sequelize.ENUM(
          'NOT_DEFINED',
          'NOT_VERIFIED',
          'VERIFIED',
          'EMPTY',
        ),
        defaultValue: 'NOT_DEFINED',
        allowNull: false,
      },
      primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created: {
        type: 'TIMESTAMP WITH TIME ZONE',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      modified: {
        type: 'TIMESTAMP WITH TIME ZONE',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    })

    // Add foreign key constraint and delete cascade
    await queryInterface.addConstraint('emails', {
      fields: ['national_id'],
      type: 'foreign key',
      name: 'emails_national_id_fkey',
      references: {
        table: 'user_profile',
        field: 'national_id',
      },
      onDelete: 'cascade',
    })

    // Avoid duplicate entries
    await queryInterface.addConstraint('emails', {
      fields: ['national_id', 'email'],
      type: 'unique',
      name: 'emails_national_id_email_unique',
    })

    // Avoid duplicate entries for primary email
    await queryInterface.addConstraint('emails', {
      fields: ['national_id', 'primary'],
      type: 'unique',
      name: 'emails_national_id_primary_unique',
    })

    // Add index for national_id
    await queryInterface.addIndex('emails', ['national_id'], {
      name: 'emails_national_id_index',
    })

    /** ACTOR PROFILE CHANGES **/

    // Add column emails to actor_profile that references emails instance
    await queryInterface.addColumn('actor_profile', 'emails_id', {
      type: Sequelize.UUID,
      references: {
        model: 'emails',
        key: 'id',
      },
      onDelete: 'SET NULL',
    })
  },

  async down(queryInterface) {
    try {
      // Remove foreign key constraint
      await queryInterface.removeConstraint('emails', 'emails_national_id_fkey')

      // Remove unique constraints
      await queryInterface.removeConstraint(
        'emails',
        'emails_national_id_email_unique',
      )
      await queryInterface.removeConstraint(
        'emails',
        'emails_national_id_primary_unique',
      )

      // Remove index
      await queryInterface.removeIndex('emails', 'emails_national_id_index')

      // Remove column from actor_profile
      await queryInterface.removeColumn('actor_profile', 'emails_id')

      // Drop table
      await queryInterface.dropTable('emails')
    } catch (error) {
      console.error('Error dropping emails table:', error)
      throw error
    }
  },
}
