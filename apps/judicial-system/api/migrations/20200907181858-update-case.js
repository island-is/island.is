'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'suspect_address', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'court', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'arrest_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('case', 'requested_court_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'suspect_address'),
      queryInterface.removeColumn('case', 'court'),
      queryInterface.removeColumn('case', 'arrest_date'),
      queryInterface.removeColumn('case', 'requested_court_date'),
    ])
  }
};
