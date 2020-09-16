'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('application', {
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
        applicant: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        assignee: {
          type: Sequelize.STRING,
        },
        ['external_id']: {
          type: Sequelize.STRING,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        attachments: {
          type: Sequelize.JSONB,
          defaultValue: {},
        },
        type_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        answers: {
          type: Sequelize.JSONB,
          defaultValue: {},
          allowNull: false,
        },
        external_data: {
          type: Sequelize.JSONB,
          defaultValue: {},
          allowNull: false,
        },
      })
      .then(() =>
        queryInterface.addIndex('application', ['type_id', 'applicant']),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('application')
  },
}
