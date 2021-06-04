'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('api_scope', 'grant_to_legal_guardians', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('api_scope', 'grant_to_procuring_holders', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('api_scope', 'allow_explicit_delegation_grant', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('api_scope', 'automatic_delegation_grant', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn('api_scope', 'also_for_delegated_user', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('api_scope', 'grant_to_legal_guardians'),
      queryInterface.removeColumn('api_scope', 'grant_to_procuring_holders'),
      queryInterface.removeColumn(
        'api_scope',
        'allow_explicit_delegation_grant',
      ),
      queryInterface.removeColumn('api_scope', 'automatic_delegation_grant'),
      queryInterface.removeColumn('api_scope', 'also_for_delegated_user'),
    ])
  },
}
