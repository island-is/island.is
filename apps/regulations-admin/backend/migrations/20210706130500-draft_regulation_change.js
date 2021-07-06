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
          changingId: {
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
