'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'staff',
          'use_pseudo_name',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize
          .query(`UPDATE "staff" SET use_pseudo_name to allow NULL;`, {
            transaction: t,
          })
          .then(() =>
            queryInterface.changeColumn(
              'staff',
              'use_pseudo_name',
              {
                type: Sequelize.BOOLEAN,
                allowNull: false,
              },
              { transaction: t },
            ),
          ),
      ]),
    )
  },
}
