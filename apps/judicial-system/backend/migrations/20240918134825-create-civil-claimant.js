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
          modified: {
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
            allowNull: true,
          },
          national_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          no_national_id: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          has_spokesperson: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          spokesperson_is_lawyer: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          spokesperson_national_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          spokesperson_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          spokesperson_email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          spokesperson_phone_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          case_files_shared_with_spokesperson: {
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
