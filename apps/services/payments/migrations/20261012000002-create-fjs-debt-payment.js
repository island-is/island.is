'use strict'

const TABLE = 'fjs_debt_payment'
const ENUM_NAME = 'enum_fjs_debt_payment_status'

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
          // Unique: a debt flow is terminal once rejected, so there is one settlement lifecycle per flow.
          payment_flow_id: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            references: {
              model: 'payment_flow',
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
          // The payFlowId sent to FJS, the payment flow id.
          pay_flow_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM(
              'pending',
              'registered',
              'rejected',
              'needs_reconciliation',
            ),
            allowNull: false,
            defaultValue: 'pending',
          },
          attempts: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          had_ambiguous_attempt: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          last_attempt_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          payment_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          amount: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          // `dateCreated` from the FJS 202 response, kept as FJS sent it
          date_created: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          last_error: {
            type: Sequelize.JSON,
            allowNull: true,
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
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable(TABLE, { transaction: t })
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "${ENUM_NAME}"`,
        { transaction: t },
      )
    })
  },
}
