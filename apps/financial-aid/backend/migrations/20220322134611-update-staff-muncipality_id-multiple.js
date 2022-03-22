'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          `UPDATE "staff" \ 
            SET "municipality_id" = ARRAY["municipality_id"];`,
          {
            transaction: t,
          },
        )
        .then(() =>
          queryInterface.changeColumn(
            'staff',
            'municipality_id',
            {
              type: Sequelize.ARRAY(Sequelize.STRING),
              allowNull: false,
            },
            { transaction: t },
          ),
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
