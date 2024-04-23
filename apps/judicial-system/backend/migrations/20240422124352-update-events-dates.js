'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.createTable(
          'explanatory_comment',
          {
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
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            comment_type: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            case_id: {
              type: Sequelize.UUID,
              references: {
                model: 'case',
                key: 'id',
              },
              allowNull: false,
            },
            comment: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'date_log',
          'location',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.dropTable('explanatory_comment', { transaction: t }),
        queryInterface.removeColumn('date_log', 'location', {
          transaction: t,
        }),
      ]),
    )
  },
}
