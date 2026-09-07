'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'defendant_event_log',
        'verdict_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'verdict',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        { transaction },
      )

      // Prefer the verdict that existed when the certificate was delivered.
      await queryInterface.sequelize.query(
        `
        UPDATE defendant_event_log AS del
        SET verdict_id = (
          SELECT v.id
          FROM verdict AS v
          WHERE v.defendant_id = del.defendant_id
            AND v.created <= del.created
          ORDER BY v.created DESC
          LIMIT 1
        )
        WHERE del.event_type = 'VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE'
          AND del.verdict_id IS NULL
        `,
        { transaction },
      )

      // Fallback when no verdict predates the event (clock skew / missing rows).
      await queryInterface.sequelize.query(
        `
        UPDATE defendant_event_log AS del
        SET verdict_id = (
          SELECT v.id
          FROM verdict AS v
          WHERE v.defendant_id = del.defendant_id
          ORDER BY v.created DESC
          LIMIT 1
        )
        WHERE del.event_type = 'VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE'
          AND del.verdict_id IS NULL
        `,
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('defendant_event_log', 'verdict_id', {
        transaction,
      })
    })
  },
}
