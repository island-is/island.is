'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'city',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'postal_code',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'municipality_code',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'street_name',
          {
            type: Sequelize.TEXT,
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
        queryInterface.removeColumn('applications', 'city', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'municipality_code', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'street_name', {
          transaction: t,
        }),
        queryInterface.removeColumn('applications', 'postal_code', {
          transaction: t,
        }),
      ]),
    )
  }
};
