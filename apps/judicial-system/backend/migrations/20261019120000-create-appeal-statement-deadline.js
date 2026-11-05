'use strict'

// The deadline the court of appeals gives each party of a verdict appeal to
// file its written statement. One row per party and appeal: a defendant
// (defendant_id), a civil claimant (civil_claimant_id) or the prosecution,
// which is the row naming neither. An extension updates the row; who set or
// moved a deadline, and when, is kept by the appeal event log.
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'appeal_statement_deadline',
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
          case_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'case', key: 'id' },
          },
          appeal_case_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'appeal_case', key: 'id' },
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
          deadline: {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: false,
          },
        },
        { transaction },
      )

      // A row names at most one party.
      await queryInterface.sequelize.query(
        `
        ALTER TABLE appeal_statement_deadline
          ADD CONSTRAINT appeal_statement_deadline_party_check CHECK (
            defendant_id IS NULL OR civil_claimant_id IS NULL
          )
        `,
        { transaction },
      )

      await queryInterface.addIndex(
        'appeal_statement_deadline',
        ['appeal_case_id'],
        {
          name: 'appeal_statement_deadline_appeal_case_id_idx',
          transaction,
        },
      )

      // One deadline per party and appeal. Three partial indexes rather than
      // one over all three columns, because NULL never equals NULL in a unique
      // index, and the prosecution's row is the one with both party columns
      // empty.
      await queryInterface.sequelize.query(
        `
        CREATE UNIQUE INDEX appeal_statement_deadline_defendant_uidx
          ON appeal_statement_deadline (appeal_case_id, defendant_id)
          WHERE defendant_id IS NOT NULL
        `,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
        CREATE UNIQUE INDEX appeal_statement_deadline_civil_claimant_uidx
          ON appeal_statement_deadline (appeal_case_id, civil_claimant_id)
          WHERE civil_claimant_id IS NOT NULL
        `,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
        CREATE UNIQUE INDEX appeal_statement_deadline_prosecution_uidx
          ON appeal_statement_deadline (appeal_case_id)
          WHERE defendant_id IS NULL AND civil_claimant_id IS NULL
        `,
        { transaction },
      )
    }),

  down: (queryInterface) =>
    queryInterface.dropTable('appeal_statement_deadline'),
}
