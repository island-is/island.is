'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn('applications', 'phone_number', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
        queryInterface.changeColumn('staff', 'phone_number', {
          type: Sequelize.STRING,
          allowNull: true,
        })
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
      queryInterface.changeColumn('applications', 'phone_number', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('staff', 'phone_number', {
        type: Sequelize.STRING,
        allowNull: false,
      })
    ]),
    )
  }
};
