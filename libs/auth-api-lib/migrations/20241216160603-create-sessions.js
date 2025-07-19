'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'session',
        {
          key: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          scheme: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          subject_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          session_id: {
            type: Sequelize.STRING,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          renewed: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          expires: {
            type: Sequelize.DATE,
          },
          data: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          actor_subject_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.addIndex('session', ['subject_id'], {
        name: 'session_subject_id_idx',
        transaction,
      })

      await queryInterface.addIndex('session', ['session_id'], {
        name: 'session_session_id_idx',
        transaction,
      })

      await queryInterface.addIndex('session', ['actor_subject_id'], {
        name: 'session_actor_subject_id_idx',
        transaction,
      })

      await queryInterface.addIndex('session', ['expires'], {
        name: 'session_expires_idx',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('session', { transaction })
    })
  },
}
