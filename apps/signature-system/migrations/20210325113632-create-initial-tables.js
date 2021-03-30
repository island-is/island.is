'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('signature_list', {
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
        type: Sequelize.STRING,
      },
      closed_date: {
        type: Sequelize.DATE,
      },
      // stores what meta fields to add to signature
      signature_meta: {
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
      'signature',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        signaturee: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        signature_list_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'signature_list',
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
          signaturee_signature_list_unique: {
            fields: ['signaturee', 'signature_list_id'],
          },
        },
      },
    )
  },

  down: async (queryInterface) => {
    return Promise.all([
      queryInterface.dropTable('signature'),
      queryInterface.dropTable('signature_list'),
    ])
  },
}
