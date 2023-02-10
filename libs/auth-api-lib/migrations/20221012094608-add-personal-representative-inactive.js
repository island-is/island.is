'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'personal_representative',
        'inactive',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction },
      )

      await queryInterface.addColumn(
        'personal_representative',
        'inactive_reason',
        {
          type: Sequelize.ENUM('DECEASED_PARTY'),
          defaultValue: null,
          allowNull: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('personal_representative', 'inactive', {
        transaction,
      })
      await queryInterface.removeColumn(
        'personal_representative',
        'inactive_reason',
        {
          transaction,
        },
      )
    })
  },
}
