'use strict'
const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return queryInterface.sequelize
      .transaction((transaction) =>
        queryInterface.bulkUpdate(
          'case_file',
          { category: 'CASE_FILE' },
          { category: 'CASE_FILE_CONTENTS' },
          { transaction },
        ),
      )
      .then(() =>
        replaceEnum({
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
          ],
          enumName: 'enum_case_file_category',
        }),
      )
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
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
        'CASE_FILE_CONTENTS',
        'CASE_FILE',
      ],
      enumName: 'enum_case_file_category',
    })
  },
}
