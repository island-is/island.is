'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'offense',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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
          indictment_count_id: {
            type: Sequelize.UUID,
            references: {
              model: 'indictment_count',
              key: 'id',
            },
            allowNull: false,
          },
          offense: {
            type: Sequelize.STRING, // DRIVING_WITHOUT_LICENCE, DRUNK_DRIVING, ...
            allowNull: false,
          },
          substances: {
            type: Sequelize.JSON,
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('offense', { transaction: t }),
    )
  },
}
