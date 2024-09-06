'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface) {
    return replaceEnum({
      queryInterface,
      tableName: 'case_file',
      columnName: 'category',
      newValues: [
        'COURT_RECORD',
        'RULING',
        'COVER_LETTER',
        'INDICTMENT',
        'CRIMINAL_RECORD',
        'COST_BREAKDOWN',
        'CASE_FILE',
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
        'CRIMINAL_RECORD_UPDATE', // new value
      ],
    })
  },

  async down(queryInterface) {
    return replaceEnum({
      queryInterface,
      tableName: 'case_file',
      columnName: 'category',
      newValues: [
        'COURT_RECORD',
        'RULING',
        'COVER_LETTER',
        'INDICTMENT',
        'CRIMINAL_RECORD',
        'COST_BREAKDOWN',
        'CASE_FILE',
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
      ],
    })
  },
}
