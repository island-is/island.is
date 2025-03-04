'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'payment_flow',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          product_id: {
            type: Sequelize.STRING(500),
            allowNull: false,
          },
          invoice_id: {
            type: Sequelize.STRING,
            allowNull: true, // Optional for general flow, required for "Mínar Síður" flow
          },
          available_payment_methods: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
          },
          on_success_url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          on_update_url: {
            type: Sequelize.STRING,
            allowNull: true, // Optional for general flow, required for "Mínar Síður" flow
          },
          on_error_url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          organisation_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          metadata: {
            type: Sequelize.JSON,
            allowNull: true, // Optional field for arbitrary JSON data that will be returned in the callbacks
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('payment_flow', { transaction: t }),
    )
  },
}
