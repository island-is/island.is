'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('program_tag',
          {
            program_id: {
              type: Sequelize.UUID,
              references: {
                model: 'program',
                key: 'id',
              },
              allowNull: false,
            },
            tag_id: {
              type: Sequelize.UUID,
              references: {
                model: 'tag',
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
        queryInterface.dropTable('program_tag', { transaction: t }),
      ]);
    });
  }
};