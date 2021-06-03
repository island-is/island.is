'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('payment', {
        applicationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'application',
            key: 'id',
          },
        },
        fulfilled: {
          type: boolean,
          allowNull: false,
          defaultValue: false
        },
        referenceId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        arkUrl: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        definition: {
          type: Sequelize.OBJECT,
        },
        amount: {
          type: Sequelize.STRING,
        },
        expiresAt: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      })
      .then(() => 
        queryInterface.addIndex('payment', ['applicationId', 'fulfilled']),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payment')
  }
};
