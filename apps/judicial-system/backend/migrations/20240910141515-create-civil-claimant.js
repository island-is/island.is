'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'civil_claimant',
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
          case_id: {
            type: Sequelize.UUID,
            references: {
              model: 'case',
              key: 'id',
            },
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          nationalId: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          defenderName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          defenderEmail: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          defenderPhoneNumber: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          caseFilesSharedWithDefender: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('civil_claimant', { transaction: t }),
    )
  },
}
