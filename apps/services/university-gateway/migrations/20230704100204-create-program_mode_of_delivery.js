'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('program_mode_of_delivery',
          {
            program_id: {
              type: Sequelize.UUID,
              references: {
                model: 'program',
                key: 'id',
              },
              allowNull: false,
            },
            mode_of_delivery_id: {
              type: Sequelize.UUID,
              references: {
                model: 'mode_of_delivery',
                key: 'id',
              },
              allowNull: false,
            },
          },
          { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('program_mode_of_delivery', { transaction: t }),
      ]);
    });
  }
};