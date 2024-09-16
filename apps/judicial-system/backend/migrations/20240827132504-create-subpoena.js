'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'subpoena',
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
          defendant_id: {
            type: Sequelize.UUID,
            references: {
              model: 'defendant',
              key: 'id',
            },
            allowNull: false,
          },
          case_id: {
            type: Sequelize.UUID,
            references: {
              model: 'case',
              key: 'id',
            },
            allowNull: true,
          },
          subpoena_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          acknowledged: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          acknowledged_date: {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: true,
          },
          registered_by: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          comment: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('subpoena', { transaction: t }),
    )
  },
}
