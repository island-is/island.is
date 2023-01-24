'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable('session', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
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
      session_id: {
        type: Sequelize.STRING,
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

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('session')
  },
}
