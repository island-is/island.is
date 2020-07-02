'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Applications', {
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
        externalId: {
          type: Sequelize.STRING,
        },
        state: {
          type: Sequelize.ENUM(
            'DRAFT',
            'BEING_PROCESSED',
            'NEEDS_INFORMATION',
            'PENDING',
            'APPROVED',
            'MANUAL_APPROVED',
            'REJECTED',
            'UNKNOWN',
          ),
          allowNull: false,
        },
        attatchments: {
          type: Sequelize.ARRAY(Sequelize.STRING),
        },
        typeId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        answers: {
          type: Sequelize.JSONB,
          defaultValue: {},
          allowNull: false,
        },
      })
      .then(() =>
        queryInterface.addIndex('Applications', ['typeId', 'applicant']),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Applications')
  },
}
