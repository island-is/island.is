'use strict'

const TABLE = 'bank_transfer_payment'
/** Only one active (non-deleted) bank transfer per payment flow. */
const ACTIVE_UNIQUE_INDEX =
  'bank_transfer_payment_one_active_per_payment_flow_id'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        TABLE,
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          payment_flow_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'payment_flow',
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
          provider: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          provider_payment_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          source_reference_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          last_known_status: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          sca_redirect_url: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
        },
        {
          transaction: t,
          uniqueKeys: {
            // A provider's payment id is unique within that provider.
            bank_transfer_payment_provider_payment_id_unique: {
              fields: ['provider', 'provider_payment_id'],
            },
          },
        },
      )

      await queryInterface.addIndex(TABLE, ['payment_flow_id'], {
        name: 'bank_transfer_payment_payment_flow_id_idx',
        transaction: t,
      })

      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX "${ACTIVE_UNIQUE_INDEX}" ON "${TABLE}" (payment_flow_id) WHERE (is_deleted = false)`,
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS "${ACTIVE_UNIQUE_INDEX}"`,
        { transaction: t },
      )
      await queryInterface.dropTable(TABLE, { transaction: t })
    })
  },
}
