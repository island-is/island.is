'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add a new temporary column to store ARRAY(STRING) values
      await queryInterface.addColumn(
        'payment_flow',
        'product_ids_temp',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true, // Temporarily allow null for the migration
        },
        { transaction: t },
      )

      // Copy and transform data from product_id to product_ids_temp
      await queryInterface.sequelize.query(
        `
        UPDATE "payment_flow"
        SET "product_ids_temp" = ARRAY["product_id"]
        `,
        { transaction: t },
      )

      // Drop the old product_id column
      await queryInterface.removeColumn('payment_flow', 'product_id', {
        transaction: t,
      })

      // Rename the temporary column to product_ids
      await queryInterface.renameColumn(
        'payment_flow',
        'product_ids_temp',
        'product_ids',
        { transaction: t },
      )

      // Ensure the new column is not nullable
      await queryInterface.changeColumn(
        'payment_flow',
        'product_ids',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add a temporary column to store STRING values
      await queryInterface.addColumn(
        'payment_flow',
        'product_id_temp',
        {
          type: Sequelize.STRING(500),
          allowNull: true, // Temporarily allow null for the migration
        },
        { transaction: t },
      )

      // Copy and transform data from product_ids back to product_id_temp
      await queryInterface.sequelize.query(
        `
        UPDATE "payment_flow"
        SET "product_id_temp" = "product_ids"[1] -- Extract the first element of the array
        `,
        { transaction: t },
      )

      // Drop the product_ids column
      await queryInterface.removeColumn('payment_flow', 'product_ids', {
        transaction: t,
      })

      // Rename the temporary column to product_id
      await queryInterface.renameColumn(
        'payment_flow',
        'product_id_temp',
        'product_id',
        { transaction: t },
      )

      // Ensure the old column is not nullable
      await queryInterface.changeColumn(
        'payment_flow',
        'product_id',
        {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        { transaction: t },
      )
    })
  },
}
