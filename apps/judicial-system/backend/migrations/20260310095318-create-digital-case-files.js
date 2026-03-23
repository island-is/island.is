'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.createTable(
        'police_digital_case_file',
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
          police_case_number: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          police_digital_file_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          police_external_vendor_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          name: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          display_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          order_within_chapter: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
        },
        { transaction },
      ),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('police_digital_case_file', { transaction }),
    )
  },
}
