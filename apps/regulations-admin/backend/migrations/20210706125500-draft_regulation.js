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
          draftingStatus: {
            type: Sequelize.ENUM('draft', 'proposal', 'shipped'),
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
          draftingNotes: {
            type: Sequelize.TEXT,
          },
          idealPublishDate: {
            type: Sequelize.DATEONLY,
          },
          ministryId: {
            type: Sequelize.STRING,
          },
          signatureDate: {
            type: Sequelize.DATEONLY,
          },
          effectiveDate: {
            type: Sequelize.DATEONLY,
          },
          type: {
            type: Sequelize.ENUM('base', 'amending'),
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
