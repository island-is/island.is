'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('endorsement_list', 'meta', {
      type: Sequelize.JSONB,
      defaultValue: '{}',
      allowNull: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('endorsement_list', 'meta')
  },
}
