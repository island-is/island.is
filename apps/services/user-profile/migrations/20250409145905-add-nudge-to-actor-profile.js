'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'actor_profile',
        'last_nudge',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      )

      await queryInterface.addColumn(
        'actor_profile',
        'next_nudge',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('actor_profile', 'last_nudge', {
        transaction,
      })

      await queryInterface.removeColumn('actor_profile', 'next_nudge', {
        transaction,
      })
    })
  },
}
