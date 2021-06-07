'use strict';

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
        applicationId: {
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
          defaultValue: false
        },
        referenceId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        user4: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        definition: {
          type: Sequelize.STRING,
        },
        amount: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        /// maybe remove.
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      })
      .then(() => 
        queryInterface.addIndex('payment', ['applicationId']),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payment')
  }
};
