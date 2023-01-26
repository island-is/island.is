'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('session', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      actor_national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject_national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: 'TIMESTAMP WITH TIME ZONE',
        allowNull: false,
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created: {
        type: 'TIMESTAMP WITH TIME ZONE',
        allowNull: false,
      },
    })
  },

  down(queryInterface) {
    return queryInterface.dropTable('session')
  },
}
