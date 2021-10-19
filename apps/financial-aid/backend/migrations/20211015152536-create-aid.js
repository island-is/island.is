'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'aid',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          municipality_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          own_place: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          registered_renting: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          unregistered_renting: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          lives_with_parents: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          with_parents: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          unknown: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          type: {
            allowNull: true,
            type: Sequelize.ENUM(
              'Individual',
              'Cohabitation',
            ),
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
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('aid', { transaction: t }),
    )
  }
};
