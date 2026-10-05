'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'delegation_confirmation',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          delegation_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: { model: 'delegation', key: 'id' },
            onUpdate: 'CASCADE',
            // Evidence must outlive the delegation it was created for.
            onDelete: 'SET NULL',
          },
          from_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          actor_national_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          to_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          domain_name: {
            type: Sequelize.STRING,
            allowNull: true,
            references: { model: 'domain', key: 'name' },
            onUpdate: 'CASCADE',
            onDelete: 'NO ACTION',
          },
          status: {
            type: Sequelize.ENUM(
              'pending',
              'confirmed',
              'expired',
              'rejected',
              'superseded',
            ),
            allowNull: false,
            defaultValue: 'pending',
          },
          content_snapshot: {
            type: Sequelize.JSONB,
            allowNull: false,
          },
          content_hash: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          content_hash_alg: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          requested_acr: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          expires_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          confirmed_at: {
            type: Sequelize.DATE,
          },
          confirming_national_id: {
            type: Sequelize.STRING,
          },
          acr: {
            type: Sequelize.STRING,
          },
          amr: {
            type: Sequelize.JSONB,
          },
          auth_time: {
            type: Sequelize.DATE,
          },
          confirmed_sub: {
            type: Sequelize.STRING,
          },
          confirmed_sid: {
            type: Sequelize.STRING,
          },
          confirmed_client_id: {
            type: Sequelize.STRING,
          },
          confirmed_ip: {
            type: Sequelize.STRING,
          },
          confirmed_user_agent: {
            type: Sequelize.STRING,
          },
          receipt_issuer: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          attempt_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          auth_req_id: {
            type: Sequelize.STRING,
          },
          auth_method: {
            type: Sequelize.STRING,
          },
          auth_started_at: {
            type: Sequelize.DATE,
          },
          auth_start_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          certificate_thumbprint: {
            type: Sequelize.STRING,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.addIndex('delegation_confirmation', {
        fields: ['from_national_id', 'status'],
        name: 'delegation_confirmation_from_national_id_status',
        transaction,
      })

      await queryInterface.addIndex('delegation_confirmation', {
        fields: ['status', 'expires_at'],
        name: 'delegation_confirmation_status_expires_at',
        transaction,
      })

      await queryInterface.addIndex('delegation_confirmation', {
        fields: ['delegation_id'],
        name: 'delegation_confirmation_delegation_id',
        transaction,
      })

      // At most one pending confirmation per grantor/recipient/domain, so a
      // re-submission supersedes rather than duplicating.
      await queryInterface.addIndex('delegation_confirmation', {
        fields: ['from_national_id', 'to_national_id', 'domain_name'],
        name: 'delegation_confirmation_unique_pending',
        unique: true,
        where: { status: 'pending' },
        transaction,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('delegation_confirmation', { transaction })
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_delegation_confirmation_status"',
        { transaction },
      )
    })
  },
}
