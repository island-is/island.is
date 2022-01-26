'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'draft_regulation',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          drafting_status: {
            type: Sequelize.ENUM('draft', 'proposal', 'shipped', 'published'),
          },
          name: {
            type: Sequelize.STRING,
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
          drafting_notes: {
            type: Sequelize.TEXT,
          },
          ideal_publish_date: {
            type: Sequelize.DATEONLY,
          },
          ministry: {
            type: Sequelize.STRING,
          },
          signature_date: {
            type: Sequelize.DATEONLY,
          },
          signature_text: {
            type: Sequelize.TEXT,
          },
          effective_date: {
            type: Sequelize.DATEONLY,
          },
          type: {
            type: Sequelize.ENUM('base', 'amending'),
          },
          authors: {
            type: Sequelize.ARRAY(Sequelize.STRING),
          },
          law_chapters: {
            type: Sequelize.ARRAY(Sequelize.STRING),
          },
          signed_document_url: {
            type: Sequelize.STRING,
          },
          fast_track: {
            type: Sequelize.BOOLEAN,
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
      queryInterface.dropTable('draft_regulation', { transaction: t }),
    )
  },
}
