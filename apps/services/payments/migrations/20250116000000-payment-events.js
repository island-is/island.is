'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Remove all payment flows that don't have an 'on_update_url'
      // since we are going to make it required
      await queryInterface.bulkDelete('payment_flow', {
        on_update_url: { [Sequelize.Op.eq]: null },
      })

      // Remove 'on_success_url' and 'on_error_url'
      await queryInterface.removeColumn('payment_flow', 'on_success_url', {
        transaction: t,
      })
      await queryInterface.removeColumn('payment_flow', 'on_error_url', {
        transaction: t,
      })

      // Update 'on_update_url' to be required
      await queryInterface.changeColumn(
        'payment_flow',
        'on_update_url',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t },
      )

      // Create the new table that will store the update events sent to onUpdateUrl
      await queryInterface.createTable(
        'payment_flow_event',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
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
          type: {
            type: Sequelize.ENUM(
              'create',
              'update',
              'success',
              'error',
              'delete',
            ),
            allowNull: false,
          },
          reason: {
            type: Sequelize.ENUM(
              'payment_started',
              'payment_completed',
              'payment_failed',
              'deleted_admin',
              'deleted_auto',
              'other',
            ),
            allowNull: false,
          },
          payment_method: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          occurred_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          message: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          metadata: {
            type: Sequelize.JSON,
            allowNull: true, // Optional field for arbitrary event-specific JSON data that will be returned in the callbacks
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction: t },
      )

      //
      await queryInterface.addIndex(
        'payment_flow_event',
        ['payment_flow_id', 'type'],
        {
          name: 'payment_flow_event_payment_flow_id_type_idx',
          where: {
            type: 'success',
          },
          transaction: t,
        },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('payment_flow_event', { transaction: t })
      await queryInterface.removeIndex(
        'payment_flow_event',
        'payment_flow_event_payment_flow_id_type_idx',
        {
          transaction: t,
        },
      )

      // Revert 'on_update_url' to be optional
      await queryInterface.changeColumn(
        'payment_flow',
        'on_update_url',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )

      // Add back 'on_success_url' and 'on_error_url'
      await queryInterface.addColumn(
        'payment_flow',
        'on_success_url',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'payment_flow',
        'on_error_url',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t },
      )
    })
  },
}
