'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('state_history', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      application_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'application',
          key: 'id',
        },
      },
      state_key: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      entry_timestamp: {
        type: 'TIMESTAMP WITH TIME ZONE',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      exit_timestamp: {
        type: 'TIMESTAMP WITH TIME ZONE',
        defaultValue: null,
        allowNull: true,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('state_history')
  },
}
