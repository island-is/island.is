'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'description'),
      queryInterface.changeColumn('case', 'suspect_name', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'description', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
      queryInterface.changeColumn('case', 'suspect_name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
    ])
  }
}
