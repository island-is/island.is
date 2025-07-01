'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() =>
      Promise.all([
        queryInterface.changeColumn('user_profile', 'email', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() =>
      Promise.all([
        queryInterface.changeColumn('user_profile', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
        }),
      ]),
    )
  },
}
