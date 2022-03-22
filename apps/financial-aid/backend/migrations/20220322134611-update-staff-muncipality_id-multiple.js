'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'staff',
          'municipality_ids',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
          },
          {
            transaction: t,
          },
        )
        .then(() =>
          queryInterface.sequelize.query(
            'UPDATE "staff" SET municipality_ids = ARRAY[municipality_id] WHERE municipality_id IS NOT NULL',
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('staff', 'municipality_id', {
            transaction: t,
          }),
        ),
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'staff',
          'municipality_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
