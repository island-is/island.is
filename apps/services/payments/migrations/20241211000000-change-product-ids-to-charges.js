'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete(
        'payment_flow',
        {
          product_ids: { [Sequelize.Op.ne]: null },
        },
        { transaction: t },
      )

      await queryInterface.removeColumn('payment_flow', 'product_ids', {
        transaction: t,
      })

      await queryInterface.createTable(
        'payment_flow_charge',
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          payment_flow_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'payment_flow',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          charge_type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          charge_item_code: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          price: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow',
        'product_ids',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true, // allow null while the migration is running
        },
        { transaction: t },
      )

      const paymentFlows = await queryInterface.sequelize.query(
        `SELECT id FROM payment_flow`,
        { type: Sequelize.QueryTypes.SELECT, transaction: t },
      )

      for (const flow of paymentFlows) {
        const charges = await queryInterface.sequelize.query(
          `SELECT charge_item_code FROM payment_flow_charge WHERE payment_flow_id = :id`,
          {
            replacements: { id: flow.id },
            type: Sequelize.QueryTypes.SELECT,
            transaction: t,
          },
        )
        const productIds = charges.map((charge) => charge.chargeItemCode)
        await queryInterface.sequelize.query(
          `UPDATE payment_flow SET product_ids = :productIds WHERE id = :id`,
          { replacements: { productIds, id: flow.id }, transaction: t },
        )
      }

      await queryInterface.changeColumn(
        'payment_flow',
        'product_ids',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false, // disallow null after the migration
        },
        { transaction: t },
      )

      await queryInterface.dropTable('payment_flow_charge', { transaction: t })
    })
  },
}
