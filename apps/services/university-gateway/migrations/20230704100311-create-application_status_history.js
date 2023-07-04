'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('application_status_history',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            application_id: {
              type: Sequelize.UUID,
              references: {
                model: 'application',
                key: 'id',
              },
              allowNull: false,
            },
            old_status_id: {
              type: Sequelize.UUID,
              references: {
                model: 'application_status',
                key: 'id',
              },
              allowNull: false,
            },
            new_status_id: {
              type: Sequelize.UUID,
              references: {
                model: 'application_status',
                key: 'id',
              },
              allowNull: false,
            },
            date_modified: {
              type: Sequelize.DATE,
            },
            
          },
          { transaction: t }),
              ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('application_status_history', { transaction: t }),
      ]);
    });
  }
};