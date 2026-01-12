'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.createTable(
        'court_session_string',
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
          string_type: { type: Sequelize.STRING, allowNull: true },
          case_id: {
            type: Sequelize.UUID,
            references: { model: 'case', key: 'id' },
            allowNull: false,
          },
          court_session_id: {
            type: Sequelize.UUID,
            references: { model: 'court_session', key: 'id' },
            allowNull: false,
          },
          merged_case_id: {
            type: Sequelize.UUID,
            references: { model: 'case', key: 'id' },
            allowNull: true,
          },
          value: { type: Sequelize.TEXT, allowNull: true },
        },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('court_session_string', { transaction }),
    )
  },
}
