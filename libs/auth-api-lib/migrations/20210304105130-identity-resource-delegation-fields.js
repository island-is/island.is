'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'identity_resource',
        'grant_to_legal_guardians',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'identity_resource',
        'grant_to_procuring_holders',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'identity_resource',
        'allow_explicit_delegation_grant',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'identity_resource',
        'automatic_delegation_grant',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      ),
      queryInterface.addColumn('identity_resource', 'also_for_delegated_user', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'identity_resource',
        'grant_to_legal_guardians',
      ),
      queryInterface.removeColumn(
        'identity_resource',
        'grant_to_procuring_holders',
      ),
      queryInterface.removeColumn(
        'identity_resource',
        'allow_explicit_delegation_grant',
      ),
      queryInterface.removeColumn(
        'identity_resource',
        'automatic_delegation_grant',
      ),
      queryInterface.removeColumn(
        'identity_resource',
        'also_for_delegated_user',
      ),
    ])
  },
}
