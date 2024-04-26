'use strict'
const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case_file',
      columnName: 'category',
      newValues: [
        'APPEAL_RULING',
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
        'PROSECUTOR_APPEAL_CASE_FILE', //new value
        'DEFENDANT_APPEAL_CASE_FILE', //new value
      ],
      enumName: 'enum_case_file_category',
    })
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return queryInterface.sequelize
      .transaction((transaction) =>
        Promise.all([
          queryInterface.bulkUpdate(
            'case_file',
            { category: 'PROSECUTOR_APPEAL_BRIEF_CASE_FILE' },
            { category: 'PROSECUTOR_APPEAL_CASE_FILE' },
            { transaction },
          ),
          queryInterface.bulkUpdate(
            'case_file',
            { category: 'DEFENDANT_APPEAL_BRIEF_CASE_FILE' },
            { category: 'DEFENDANT_APPEAL_CASE_FILE' },
            { transaction },
          ),
        ]),
      )
      .then(() =>
        replaceEnum({
          queryInterface,
          tableName: 'case_file',
          columnName: 'category',
          newValues: [
            'APPEAL_RULING',
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
          ],
          enumName: 'enum_case_file_category',
        }),
      )
  },
}
