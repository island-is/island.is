'use strict'

module.exports = {
  async up(queryInterface) {
    // Wrap in transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove email field from user_profile table
      await queryInterface.removeColumn('user_profile', 'email', {
        transaction,
      })

      // Remove email_status field from user_profile table
      await queryInterface.removeColumn('user_profile', 'email_status', {
        transaction,
      })

      // Remove email_verified_at field from user_profile table
      await queryInterface.removeColumn('user_profile', 'email_verified', {
        transaction,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    // Wrap in transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Re-add email field to user_profile table
      await queryInterface.addColumn(
        'user_profile',
        'email',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )

      // Re-add email_status field to user_profile table
      await queryInterface.addColumn(
        'user_profile',
        'email_status',
        {
          type: Sequelize.ENUM(
            'NOT_DEFINED',
            'NOT_VERIFIED',
            'VERIFIED',
            'EMPTY',
          ),
          defaultValue: 'NOT_DEFINED',
          allowNull: false,
        },
        { transaction },
      )

      // Re-add email_verified_at field to user_profile table
      await queryInterface.addColumn(
        'user_profile',
        'email_verified',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      )
    })
  },
}
