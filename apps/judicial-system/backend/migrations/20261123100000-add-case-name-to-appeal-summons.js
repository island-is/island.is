'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appeal_summons', 'case_name', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('appeal_summons', 'case_name')
  },
}
