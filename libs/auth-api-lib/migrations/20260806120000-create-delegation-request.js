'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delegation_request', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      from_national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      to_national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      domain_name: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'domain',
          key: 'name',
        },
        onDelete: 'CASCADE',
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected',
          'cancelled',
          'expired',
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_by_national_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resolved_by_national_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resolved_delegation_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      modified: {
        type: Sequelize.DATE,
      },
    })

    await queryInterface.createTable('delegation_request_scope', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      delegation_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'delegation_request',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      scope_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'api_scope',
          key: 'name',
        },
        onDelete: 'CASCADE',
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      modified: {
        type: Sequelize.DATE,
      },
    })

    // Only one live (pending) request per grantor/requester/domain triple.
    await queryInterface.addIndex('delegation_request', {
      name: 'delegation_request_unique_pending',
      unique: true,
      fields: ['from_national_id', 'to_national_id', 'domain_name'],
      where: { status: 'pending' },
    })

    // Fast lookups for the incoming (grantor) and outgoing (requester) lists.
    await queryInterface.addIndex('delegation_request', {
      name: 'delegation_request_from_status_idx',
      fields: ['from_national_id', 'status'],
    })
    await queryInterface.addIndex('delegation_request', {
      name: 'delegation_request_to_status_idx',
      fields: ['to_national_id', 'status'],
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('delegation_request_scope')
    await queryInterface.dropTable('delegation_request')
    // Drop the enum type created for the status column.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_delegation_request_status";',
    )
  },
}
