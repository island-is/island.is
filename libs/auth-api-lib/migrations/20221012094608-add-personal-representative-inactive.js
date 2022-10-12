'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('personal_representative', 'inactive', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('personal_representative', 'inactiveReason', {
        type: Sequelize.ENUM('DECEASED_PARTY'),
        defaultValue: null,
        allowNull: true,
      }),
    ])
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('personal_representative', 'inactive', {
        transaction,
      })
      await queryInterface.removeColumn(
        'personal_representative',
        'inactiveReason',
        {
          transaction,
        },
      )
    })
  },
}
