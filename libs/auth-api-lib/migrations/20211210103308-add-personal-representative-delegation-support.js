'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('client', 'supports_personal_representatives', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn(
        'api_scope',
        'grant_to_personal_representatives',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'client',
        'supports_personal_representatives',
      ),
      queryInterface.removeColumn(
        'api_scope',
        'grant_to_personal_representatives',
      ),
    ])
  },
}
