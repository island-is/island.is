'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'defendant',
          'defender_name',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'defendant',
          'defender_national_id',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'defendant',
          'defender_email',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'defendant',
          'defender_phone_number',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('defendant', 'defender_name', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'defender_national_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'defender_email', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'defender_phone_number', {
          transaction: t,
        }),
      ]),
    )
  },
}
