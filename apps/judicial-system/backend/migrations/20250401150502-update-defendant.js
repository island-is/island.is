'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'defendant',
          'is_alternative_service',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'defendant',
          'alternative_service_description',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('defendant', 'is_alternative_service', {
          transaction,
        }),
        queryInterface.removeColumn(
          'defendant',
          'alternative_service_description',
          { transaction },
        ),
      ]),
    )
  },
}
