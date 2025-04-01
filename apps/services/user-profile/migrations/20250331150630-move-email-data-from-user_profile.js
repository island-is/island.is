'use strict'

const { uuid } = require('uuidv4')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Move email data from user_profile to user
      const userProfiles = await queryInterface.sequelize.query(
        'SELECT * FROM user_profile',
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      )

      // Insert data into emails table
      await queryInterface.bulkInsert(
        'emails',
        userProfiles.map((profile) => ({
          id: uuid(),
          national_id: profile.national_id,
          email: profile.email,
          email_status: profile.email_status,
          primary: true,
          created: new Date(),
          modified: new Date(),
        })),
      )

      // Clean up: Remove all email related columns from user_profile
      await queryInterface.removeColumn('user_profile', 'email_status', {
        transaction,
      })
      await queryInterface.removeColumn('user_profile', 'email_verified', {
        transaction,
      })
      await queryInterface.removeColumn('user_profile', 'email', {
        transaction,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.transaction(async (transaction) => {
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

      await queryInterface.addColumn(
        'user_profile',
        'email_verified',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        { transaction },
      )

      await queryInterface.addColumn(
        'user_profile',
        'email',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )
    })
  },
}
