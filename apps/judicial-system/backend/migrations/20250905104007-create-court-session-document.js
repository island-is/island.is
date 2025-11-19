'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.createTable(
        'court_document',
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
          case_id: {
            type: Sequelize.UUID,
            references: { model: 'case', key: 'id' },
            allowNull: false,
          },
          court_session_id: {
            type: Sequelize.UUID,
            references: { model: 'court_session', key: 'id' },
            allowNull: true,
          },
          document_type: { type: Sequelize.STRING, allowNull: false },
          document_order: { type: Sequelize.INTEGER, allowNull: false },
          name: { type: Sequelize.STRING, allowNull: false },
          case_file_id: {
            type: Sequelize.UUID,
            references: { model: 'case_file', key: 'id' },
            allowNull: true,
          },
          generated_pdf_uri: { type: Sequelize.STRING, allowNull: true },
        },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('court_document', { transaction }),
    )
  },
}
