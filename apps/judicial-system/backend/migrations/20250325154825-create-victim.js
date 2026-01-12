'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'victim',
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
          has_national_id: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          national_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          has_lawyer: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          lawyer_national_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lawyer_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lawyer_email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lawyer_phone_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lawyer_access_to_request: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('victim', { transaction: t }),
    )
  },
}
