'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .transaction((t) =>
        Promise.all([
          queryInterface.addColumn(
            'case_file',
            'file_representative',
            {
              type: Sequelize.STRING,
              allowNull: true,
            },
            { transaction: t },
          ),
        ]),
      )
      .then(() => {
        // replaceEnum does not support transactions
        return replaceEnum({
          queryInterface,
          tableName: 'case_file',
          columnName: 'category',
          newValues: [
            'COURT_RECORD',
            'RULING',
            'CRIMINAL_RECORD',
            'CRIMINAL_RECORD_UPDATE',
            'COST_BREAKDOWN',
            'CASE_FILE',
            'CASE_FILE_RECORD',
            'PROSECUTOR_CASE_FILE',
            'DEFENDANT_CASE_FILE',
            'PROSECUTOR_APPEAL_BRIEF',
            'DEFENDANT_APPEAL_BRIEF',
            'PROSECUTOR_APPEAL_BRIEF_CASE_FILE',
            'DEFENDANT_APPEAL_BRIEF_CASE_FILE',
            'PROSECUTOR_APPEAL_STATEMENT',
            'DEFENDANT_APPEAL_STATEMENT',
            'PROSECUTOR_APPEAL_STATEMENT_CASE_FILE',
            'DEFENDANT_APPEAL_STATEMENT_CASE_FILE',
            'PROSECUTOR_APPEAL_CASE_FILE',
            'DEFENDANT_APPEAL_CASE_FILE',
            'INDEPENDENT_DEFENDANT_CASE_FILE', // new
            'CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE', // new
            'CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE', // new
            'APPEAL_COURT_RECORD',
            'APPEAL_RULING',
            'CIVIL_CLAIM',
            'SENT_TO_PRISON_ADMIN_FILE',
          ],
          enumName: 'enum_case_file_category',
        })
      })
  },
  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case_file', 'file_representative', {
          transaction: t,
        })
        .then(() => {
          // replaceEnum does not support transactions
          return replaceEnum({
            queryInterface,
            tableName: 'case_file',
            columnName: 'category',
            newValues: [
              'COURT_RECORD',
              'RULING',
              'CRIMINAL_RECORD',
              'CRIMINAL_RECORD_UPDATE',
              'COST_BREAKDOWN',
              'CASE_FILE',
              'CASE_FILE_RECORD',
              'PROSECUTOR_CASE_FILE',
              'DEFENDANT_CASE_FILE',
              'PROSECUTOR_APPEAL_BRIEF',
              'DEFENDANT_APPEAL_BRIEF',
              'PROSECUTOR_APPEAL_BRIEF_CASE_FILE',
              'DEFENDANT_APPEAL_BRIEF_CASE_FILE',
              'PROSECUTOR_APPEAL_STATEMENT',
              'DEFENDANT_APPEAL_STATEMENT',
              'PROSECUTOR_APPEAL_STATEMENT_CASE_FILE',
              'DEFENDANT_APPEAL_STATEMENT_CASE_FILE',
              'PROSECUTOR_APPEAL_CASE_FILE',
              'DEFENDANT_APPEAL_CASE_FILE',
              'APPEAL_COURT_RECORD',
              'APPEAL_RULING',
              'CIVIL_CLAIM',
              'SENT_TO_PRISON_ADMIN_FILE',
            ],
            enumName: 'enum_case_file_category',
          })
        }),
    )
  },
}
