'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Rename fjs charge table, no longer just confirmations
      await queryInterface.renameTable(
        'payment_flow_fjs_charge_confirmation',
        'fjs_charge',
        { transaction: t },
      )

      // Since payment confirmations are not just cards anymore, we need to rename the table
      await queryInterface.renameTable(
        'payment_flow_payment_confirmation',
        'card_payment_details',
        { transaction: t },
      )

      // Rename existing index on payment_flow_id
      await queryInterface.sequelize.query(
        `
        DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_class c
            WHERE c.relname = 'payment_flow_fjs_charge_confirmation_payment_flow_id_idx'
          ) THEN
            ALTER INDEX payment_flow_fjs_charge_confirmation_payment_flow_id_idx
            RENAME TO fjs_charge_payment_flow_id_idx;
          END IF;
        END $$;
        `,
        { transaction: t },
      )

      // Add status enum column with default to fjs_charge table
      await queryInterface.addColumn(
        'fjs_charge',
        'status',
        {
          type: Sequelize.ENUM(
            'unpaid',
            'paid',
            'cancelled',
            'recreated',
            'recreatedAndPaid',
          ),
          allowNull: false,
          defaultValue: 'unpaid',
        },
        { transaction: t },
      )

      // Composite index for payment_flow_id + reception_id lookups
      await queryInterface.addIndex(
        'fjs_charge',
        ['payment_flow_id', 'reception_id'],
        {
          name: 'idx_fjs_charge_payment_flow_reception',
          unique: true, // This combination should be unique
          transaction: t,
        },
      )

      // Mark FJS charges as paid when there is a card payment found for the same payment flow id
      await queryInterface.sequelize.query(
        `
        UPDATE fjs_charge f
        SET status = 'paid'
        WHERE f.status = 'unpaid'
          AND EXISTS (
            SELECT 1
            FROM card_payment_details c
            WHERE c.payment_flow_id = f.payment_flow_id
          )
        `,
        { transaction: t },
      )

      // Create the payment fulfillment table which will be source of truth of which payments have been made
      await queryInterface.createTable(
        'payment_fulfillment',
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
            unique: true, // To prevent double payments
          },
          payment_method: {
            type: Sequelize.ENUM('card', 'invoice'),
            allowNull: false,
          },
          confirmation_ref_id: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          fjs_charge_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'fjs_charge',
              key: 'id',
            },
            onDelete: 'CASCADE',
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
            unique_payment_method_confirmation_ref_id: {
              fields: ['payment_method', 'confirmation_ref_id'],
            },
          },
        },
      )

      // Create payment fulfillments for existing card payments
      await queryInterface.sequelize.query(
        `
          WITH picked AS (
            SELECT DISTINCT ON (c.payment_flow_id)
                  c.id          AS confirmation_id,
                  c.payment_flow_id,
                  c.created,
                  c.modified
            FROM card_payment_details c
            ORDER BY c.payment_flow_id, c.created DESC, c.id DESC
          )
          INSERT INTO payment_fulfillment
            (id, payment_flow_id, payment_method, confirmation_ref_id, fjs_charge_id, created, modified)
          SELECT
            uuid_generate_v4(),
            p.payment_flow_id,
            'card',
            p.confirmation_id,
            f.id,
            COALESCE(p.created, NOW()),
            COALESCE(p.modified, NOW())
          FROM picked p
          LEFT JOIN fjs_charge f ON f.payment_flow_id = p.payment_flow_id
          ON CONFLICT (payment_flow_id) DO NOTHING;
        `,
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Drop the payment fulfillment table
      await queryInterface.dropTable('payment_fulfillment', { transaction: t })

      // Drop the composite index that was added to fjs_charge
      await queryInterface.removeIndex(
        'fjs_charge',
        'idx_fjs_charge_payment_flow_reception',
        {
          transaction: t,
        },
      )

      // Remove the status column and its enum type from fjs_charge
      await queryInterface.removeColumn('fjs_charge', 'status', {
        transaction: t,
      })

      // Drop the enum type for status
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_fjs_charge_status";`,
        { transaction: t },
      )

      // Revert the fjs charge table rename and its index from fjs_charge
      await queryInterface.sequelize.query(
        `
        DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_class c
            WHERE c.relname = 'fjs_charge_payment_flow_id_idx'
          ) THEN
            ALTER INDEX fjs_charge_payment_flow_id_idx
            RENAME TO payment_flow_fjs_charge_confirmation_payment_flow_id_idx;
          END IF;
        END $$;
        `,
        { transaction: t },
      )

      await queryInterface.renameTable(
        'fjs_charge',
        'payment_flow_fjs_charge_confirmation',
        { transaction: t },
      )

      // Revert the card payment details table rename
      await queryInterface.renameTable(
        'card_payment_details',
        'payment_flow_payment_confirmation',
        { transaction: t },
      )

      // Drop the enum type for payment_method
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_payment_fulfillment_payment_method";`,
        { transaction: t },
      )
    })
  },
}
