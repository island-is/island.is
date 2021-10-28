'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
      queryInterface.addColumn(
        'applications',
        'spouse_name',
        {
          type: Sequelize.STRING,
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
      queryInterface.removeColumn('applications', 'spouse_name', {
        transaction: t,
      }),
    ]),
  )
  }
};
