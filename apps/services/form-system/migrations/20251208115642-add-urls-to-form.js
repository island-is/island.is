'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'form',
        'submission_service_url',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'form',
        'validation_service_url',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('form', 'submission_service_url', {
        transaction: t,
      })
      await queryInterface.removeColumn('form', 'validation_service_url', {
        transaction: t,
      })
    })
  },
}
