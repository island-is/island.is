'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('application', 'actors', {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: [],
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'actors'),
      ]),
    )
  },
}
