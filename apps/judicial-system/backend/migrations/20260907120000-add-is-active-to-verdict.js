'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'verdict',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        { transaction },
      )

      // Keep only the newest verdict active per defendant (edge cases after
      // unique(defendant_id) was dropped and a replacement verdict was created).
      await queryInterface.sequelize.query(
        `
        UPDATE verdict
        SET is_active = false
        WHERE id IN (
          SELECT id FROM (
            SELECT id,
                   ROW_NUMBER() OVER (
                     PARTITION BY defendant_id
                     ORDER BY created DESC
                   ) AS rn
            FROM verdict
          ) ranked
          WHERE rn > 1
        )
        `,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
        CREATE UNIQUE INDEX verdict_defendant_id_active_key
        ON verdict (defendant_id)
        WHERE is_active = true
        `,
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS verdict_defendant_id_active_key`,
        { transaction },
      )

      await queryInterface.removeColumn('verdict', 'is_active', {
        transaction,
      })
    })
  },
}
