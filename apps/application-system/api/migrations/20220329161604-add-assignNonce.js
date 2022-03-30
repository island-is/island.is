'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('application', 'assign_nonces', {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: [],
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'assign_nonces'),
      ]),
    )
  },
}
