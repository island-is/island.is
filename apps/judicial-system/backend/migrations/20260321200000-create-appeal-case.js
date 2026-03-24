'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'appeal_case',
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
              references: { model: 'case', key: 'id' },
              allowNull: false,
              unique: true,
            },
            appeal_state: {
              type: '"enum_case_appeal_state"',
              allowNull: true,
            },
            appeal_case_number: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            appeal_received_by_court_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            prosecutor_statement_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            defendant_statement_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            appeal_assistant_id: {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            appeal_judge1_id: {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            appeal_judge2_id: {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            appeal_judge3_id: {
              type: Sequelize.UUID,
              references: { model: 'user', key: 'id' },
              allowNull: true,
            },
            appeal_ruling_decision: {
              type: '"enum_case_appeal_ruling_decision"',
              allowNull: true,
            },
            appeal_conclusion: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            appeal_ruling_modified_history: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            request_appeal_ruling_not_to_be_published: {
              type: '"enum_request_appeal_ruling_not_to_be_published"[]',
              allowNull: true,
            },
            appeal_valid_to_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            is_appeal_custody_isolation: {
              type: Sequelize.BOOLEAN,
              allowNull: true,
            },
            appeal_isolation_to_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `INSERT INTO appeal_case (
                id,
                created,
                modified,
                case_id,
                appeal_state,
                appeal_case_number,
                appeal_received_by_court_date,
                prosecutor_statement_date,
                defendant_statement_date,
                appeal_assistant_id,
                appeal_judge1_id,
                appeal_judge2_id,
                appeal_judge3_id,
                appeal_ruling_decision,
                appeal_conclusion,
                appeal_ruling_modified_history,
                request_appeal_ruling_not_to_be_published,
                appeal_valid_to_date,
                is_appeal_custody_isolation,
                appeal_isolation_to_date
              )
              SELECT
                gen_random_uuid(),
                NOW(),
                NOW(),
                id,
                appeal_state,
                appeal_case_number,
                appeal_received_by_court_date,
                prosecutor_statement_date,
                defendant_statement_date,
                appeal_assistant_id,
                appeal_judge1_id,
                appeal_judge2_id,
                appeal_judge3_id,
                appeal_ruling_decision,
                appeal_conclusion,
                appeal_ruling_modified_history,
                request_appeal_ruling_not_to_be_published,
                appeal_valid_to_date,
                is_appeal_custody_isolation,
                appeal_isolation_to_date
              FROM "case"
              WHERE appeal_state IS NOT NULL`,
            { transaction },
          ),
        ),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('appeal_case', { transaction }),
    )
  },
}
