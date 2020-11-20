'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.addColumn(
      'client', // table name
      'national_id', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'client', // table name
      'client_type', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('client', 'national_id'),
      queryInterface.removeColumn('client', 'client_type'),
    ]);
  }
};
