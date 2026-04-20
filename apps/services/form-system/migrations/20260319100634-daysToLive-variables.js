'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'form',
        'days_until_application_prune',
        'draft_days_to_live',
        {
          transaction: t,
        },
      )

      await queryInterface.addColumn(
        'form',
        'submission_days_to_live',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 30,
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('form', 'submission_days_to_live', {
        transaction: t,
      })

      await queryInterface.renameColumn(
        'form',
        'draft_days_to_live',
        'days_until_application_prune',
        {
          transaction: t,
        },
      )
    })
  },
}
