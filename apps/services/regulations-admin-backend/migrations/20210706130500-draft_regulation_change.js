'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'draft_regulation_change',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          changing_id: {
            type: Sequelize.UUID,
            references: {
              model: 'draft_regulation',
              key: 'id',
            },
            allowNull: false,
          },
          /* Regulation name from external db */
          regulation: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
          },
          title: {
            type: Sequelize.STRING,
          },
          text: {
            type: Sequelize.TEXT,
          },
          comments: {
            type: Sequelize.STRING,
          },
          appendixes: {
            type: Sequelize.ARRAY(Sequelize.JSONB),
          },
          created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: Sequelize.DATE,
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
      queryInterface.dropTable('draft_regulation_change', { transaction: t }),
    )
  },
}
