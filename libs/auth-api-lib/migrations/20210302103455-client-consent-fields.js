'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('client', 'supports_delegation', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('client', 'supports_legal_guardians', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('client', 'supports_procuring_holders', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('client', 'prompt_delegations', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('client', 'supports_delegation'),
      queryInterface.removeColumn('client', 'supports_legal_guardians'),
      queryInterface.removeColumn('client', 'supports_procuring_holders'),
      queryInterface.removeColumn('client', 'prompt_delegations'),
    ])
  },
}
