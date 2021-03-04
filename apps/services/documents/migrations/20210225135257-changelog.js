'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('changelog', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        organisation_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'organisation',
            key: 'id',
          },
        },
        entity_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        entity_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        data: {
          type: Sequelize.JSONB,
          defaultValue: {},
          allowNull: false,
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
      })
      .then(() =>
        queryInterface.addIndex('changelog', ['organisation_id', 'entity_id']),
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('changelog')
  },
}
