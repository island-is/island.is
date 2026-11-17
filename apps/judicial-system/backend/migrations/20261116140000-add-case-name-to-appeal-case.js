'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appeal_case', 'case_name', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('appeal_case', 'case_name')
  },
}
