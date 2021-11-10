'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn('municipality', 'municipality_id', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
      queryInterface.changeColumn('municipality', 'municipality_id', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      }),
    ]),
  )
  }
};
