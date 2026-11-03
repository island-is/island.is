'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'appeal_summons_service',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          appeal_summons_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'appeal_summons', key: 'id' },
            onDelete: 'CASCADE',
          },
          defendant_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: { model: 'defendant', key: 'id' },
          },
          civil_claimant_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: { model: 'civil_claimant', key: 'id' },
          },
          sent_to_service_date: {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: false,
          },
          external_police_document_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_status: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          service_date: {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: true,
          },
          served_by: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          comment: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
        },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `ALTER TABLE appeal_summons_service
         ADD CONSTRAINT appeal_summons_service_recipient_xor_check
         CHECK (
           (defendant_id IS NOT NULL AND civil_claimant_id IS NULL)
           OR (defendant_id IS NULL AND civil_claimant_id IS NOT NULL)
         )`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX appeal_summons_service_summons_defendant_uidx
         ON appeal_summons_service (appeal_summons_id, defendant_id)
         WHERE defendant_id IS NOT NULL`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX appeal_summons_service_summons_civil_claimant_uidx
         ON appeal_summons_service (appeal_summons_id, civil_claimant_id)
         WHERE civil_claimant_id IS NOT NULL`,
        { transaction },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('appeal_summons_service', { transaction })
    })
  },
}
