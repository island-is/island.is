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
          defendant_id: {
            type: Sequelize.UUID,
            references: {
              model: 'defendant',
              key: 'id',
            },
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          national_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          defender_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          defender_email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          defender_phone_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          case_files_shared_with_defender: {
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
