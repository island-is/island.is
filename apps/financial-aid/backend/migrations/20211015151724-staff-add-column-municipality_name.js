'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'staff',
          'municipality_name',
          {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: '',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('staff', 'municipality_name', {
          transaction: t,
        }),
      ]),
    )
  }
};
