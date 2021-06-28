'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('payment', {
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
        fulfilled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        reference_id: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        user4: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        definition: {
          type: Sequelize.STRING,
        },
        amount: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        /// maybe remove.
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        created: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        modified: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      })
      .then(() => queryInterface.addIndex('payment', ['application_id']))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payment')
  },
}
