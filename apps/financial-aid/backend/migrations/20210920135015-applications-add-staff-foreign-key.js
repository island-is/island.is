'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'applications',
          'staff_id',
          { transaction: t },
        ),
        queryInterface.addColumn(
          'applications',
          'staff_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'staff',
              key: 'id',
            },
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
        queryInterface.changeColumn('applications', 'staff_id',
        {
          type: Sequelize.TEXT,
          allowNull: true
        },
        {
          transaction: t,
        }),
      ]),
    )
  }
};
