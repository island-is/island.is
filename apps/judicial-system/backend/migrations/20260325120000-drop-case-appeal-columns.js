'use strict'

const columns = [
  'appeal_state',
  'prosecutor_statement_date',
  'defendant_statement_date',
  'appeal_received_by_court_date',
  'appeal_case_number',
  'appeal_assistant_id',
  'appeal_judge1_id',
  'appeal_judge2_id',
  'appeal_judge3_id',
  'appeal_ruling_decision',
  'appeal_conclusion',
  'appeal_ruling_modified_history',
  'request_appeal_ruling_not_to_be_published',
  'appeal_valid_to_date',
  'is_appeal_custody_isolation',
  'appeal_isolation_to_date',
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      columns
        .reduce(
          (promise, column) =>
            promise.then(() =>
              queryInterface.removeColumn('case', column, { transaction }),
            ),
          Promise.resolve(),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS "enum_case_appeal_state";
             DROP TYPE IF EXISTS "enum_case_appeal_ruling_decision";
             DROP TYPE IF EXISTS "enum_request_appeal_ruling_not_to_be_published";`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.resolve()
        .then(() =>
          queryInterface.sequelize.query(
            `CREATE TYPE "enum_case_appeal_state" AS ENUM ('APPEALED', 'RECEIVED', 'COMPLETED', 'WITHDRAWN');
             CREATE TYPE "enum_case_appeal_ruling_decision" AS ENUM ('ACCEPTING', 'REPEAL', 'CHANGED', 'CHANGED_SIGNIFICANTLY', 'DISMISSED_FROM_COURT_OF_APPEAL', 'DISMISSED_FROM_COURT', 'REMAND', 'DISCONTINUED');
             CREATE TYPE "enum_request_appeal_ruling_not_to_be_published" AS ENUM ('PROSECUTOR', 'PROSECUTOR_REPRESENTATIVE', 'REGISTRAR', 'JUDGE', 'ASSISTANT', 'ADMIN', 'PRISON_SYSTEM_STAFF', 'DEFENDER');`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_state',
            { type: '"enum_case_appeal_state"', allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'prosecutor_statement_date',
            { type: Sequelize.DATE, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'defendant_statement_date',
            { type: Sequelize.DATE, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_received_by_court_date',
            { type: Sequelize.DATE, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_case_number',
            { type: Sequelize.STRING, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_assistant_id',
            {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_judge1_id',
            {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_judge2_id',
            {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_judge3_id',
            {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_ruling_decision',
            { type: '"enum_case_appeal_ruling_decision"', allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_conclusion',
            { type: Sequelize.TEXT, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_ruling_modified_history',
            { type: Sequelize.TEXT, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'request_appeal_ruling_not_to_be_published',
            {
              type: '"enum_request_appeal_ruling_not_to_be_published"[]',
              allowNull: true,
            },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_valid_to_date',
            { type: Sequelize.DATE, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'is_appeal_custody_isolation',
            { type: Sequelize.BOOLEAN, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'case',
            'appeal_isolation_to_date',
            { type: Sequelize.DATE, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" c
             SET
               appeal_state = ac.appeal_state::"enum_case_appeal_state",
               appeal_case_number = ac.appeal_case_number,
               appeal_received_by_court_date = ac.appeal_received_by_court_date,
               prosecutor_statement_date = ac.prosecutor_statement_date,
               defendant_statement_date = ac.defendant_statement_date,
               appeal_assistant_id = ac.appeal_assistant_id,
               appeal_judge1_id = ac.appeal_judge1_id,
               appeal_judge2_id = ac.appeal_judge2_id,
               appeal_judge3_id = ac.appeal_judge3_id,
               appeal_ruling_decision = ac.appeal_ruling_decision::"enum_case_appeal_ruling_decision",
               appeal_conclusion = ac.appeal_conclusion,
               appeal_ruling_modified_history = ac.appeal_ruling_modified_history,
               request_appeal_ruling_not_to_be_published = ac.request_appeal_ruling_not_to_be_published::"enum_request_appeal_ruling_not_to_be_published"[],
               appeal_valid_to_date = ac.appeal_valid_to_date,
               is_appeal_custody_isolation = ac.is_appeal_custody_isolation,
               appeal_isolation_to_date = ac.appeal_isolation_to_date
             FROM appeal_case ac
             WHERE ac.case_id = c.id`,
            { transaction },
          ),
        ),
    )
  },
}
