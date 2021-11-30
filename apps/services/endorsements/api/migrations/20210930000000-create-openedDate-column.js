'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('endorsement_list', 'opened_date', {
      type: Sequelize.DATE,
      defaultValue: new Date(),
      allowNull: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('endorsement_list', 'opened_date')
  },
}
