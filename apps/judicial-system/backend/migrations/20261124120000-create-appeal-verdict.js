'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'appeal_verdict',
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
          appeal_case_id: {
            type: Sequelize.UUID,
            references: {
              model: 'appeal_case',
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
            unique: true,
          },
          external_police_document_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_requirement: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          sent_to_service_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          service_status: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          served_by: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          comment: {
            type: Sequelize.TEXT,
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
          appeal_decision: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          appeal_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          delivered_to_defender_national_id: {
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
      queryInterface.dropTable('appeal_verdict', { transaction: t }),
    )
  },
}
