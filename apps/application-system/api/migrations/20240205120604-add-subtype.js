'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('application', 'sub_type_id', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([queryInterface.removeColumn('application', 'sub_type_id')]),
    )
  },
}
