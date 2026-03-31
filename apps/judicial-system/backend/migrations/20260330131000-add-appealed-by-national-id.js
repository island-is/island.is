'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appeal_case', 'appealed_by_national_id', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn(
      'appeal_case',
      'appealed_by_national_id',
    )
  },
}
