'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'verdict',
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
          defendant_id: {
            type: Sequelize.UUID,
            references: {
              model: 'defendant',
              key: 'id',
            },
            allowNull: false,
            unique: true,
          },
          case_id: {
            type: Sequelize.UUID,
            references: {
              model: 'case',
              key: 'id',
            },
            allowNull: false,
          },
          external_police_document_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_requirement: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          hash: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          hash_algorithm: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_status: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          served_by: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          comment: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          appeal_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          appeal_decision: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_information_for_defendant: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('verdict', { transaction: t }),
    )
  },
}
