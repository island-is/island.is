'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('endorsement_list', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      closed_date: {
        type: Sequelize.DATE,
      },
      // stores what meta fields to add to endorsement
      endorsement_meta: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      validation_rules: {
        type: Sequelize.JSONB,
        defaultValue: '[]',
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      modified: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    await queryInterface.createTable(
      'endorsement',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        endorser: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        endorsement_list_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'endorsement_list',
            key: 'id',
          },
        },
        meta: {
          type: Sequelize.JSONB,
          defaultValue: '{}',
        },
        created: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        modified: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        uniqueKeys: {
          endorser_endorsement_list_unique: {
            fields: ['endorser', 'endorsement_list_id'],
          },
        },
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('endorsement'),
      queryInterface.dropTable('endorsement_list'),
    ])
  },
}
