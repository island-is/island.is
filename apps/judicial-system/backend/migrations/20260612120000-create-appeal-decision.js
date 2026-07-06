'use strict'

// Records appeal decisions made IN COURT (Ákvörðun um kæru), one row per party:
//   - request cases (ruling_file_id NULL): the prosecution decision and a
//     single defence decision - the defence row carries no defendant_id (the
//     decision covers the defence collectively);
//   - ruling orders (ruling_file_id set): the prosecution decision and one row
//     per defendant / civil claimant, linked to the specific party.
// Indictment case-level (dismissal) appeals are out of court and are NOT stored
// here. Out-of-court "who appealed" lives in appeal_event_log, not here, so
// there is deliberately no appeal_case_id: a decision row and the appeal case
// it produces share (case_id, ruling_file_id), which connects them.
//
// There is also no court_session_id: for ruling-order decisions the recording
// session is derivable (court_session.ruling_file_id is 1:1 with a ruling
// order), and request-case decisions have no session.
//
// The composite UNIQUE uses NULLS NOT DISTINCT (PG15+) so it holds for the
// no-defendant request defence row and the per-defendant ruling-order rows
// alike.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'appeal_decision',
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
            ruling_file_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: { model: 'case_file', key: 'id' },
            },
            party_role: {
              type: Sequelize.STRING,
              allowNull: false,
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
            // Both nullable: a row may hold an announcement (yfirlýsing) typed
            // in court before the decision radio is picked, and legacy data may
            // carry an announcement without a decision. "Every party has a
            // decision" is enforced at session confirmation, not on every row.
            decision: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            announcement: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            // Party reference consistency:
            //   - PROSECUTOR: never a defendant/civil claimant id;
            //   - DEFENDANT: never a civil claimant id; defendant_id is set iff
            //     this is a ruling-order row (request defence rows carry none);
            //   - CIVIL_CLAIMANT: only on ruling orders, always a claimant id.
            `ALTER TABLE appeal_decision
               ADD CONSTRAINT appeal_decision_party_check CHECK (
                 (party_role = 'PROSECUTOR'
                   AND defendant_id IS NULL AND civil_claimant_id IS NULL) OR
                 (party_role = 'DEFENDANT' AND civil_claimant_id IS NULL
                   AND ((ruling_file_id IS NULL AND defendant_id IS NULL)
                     OR (ruling_file_id IS NOT NULL AND defendant_id IS NOT NULL))) OR
                 (party_role = 'CIVIL_CLAIMANT'
                   AND defendant_id IS NULL AND civil_claimant_id IS NOT NULL
                   AND ruling_file_id IS NOT NULL)
               )`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `CREATE UNIQUE INDEX appeal_decision_case_ruling_party_uq
               ON appeal_decision (case_id, ruling_file_id, party_role, defendant_id, civil_claimant_id)
               NULLS NOT DISTINCT`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addIndex('appeal_decision', ['case_id'], {
            name: 'appeal_decision_case_id_idx',
            transaction,
          }),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('appeal_decision', { transaction }),
    )
  },
}
