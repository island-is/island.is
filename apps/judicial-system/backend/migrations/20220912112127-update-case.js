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
        'COURT_RECORD', // new value
        'RULING', // new value
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

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case_file',
      columnName: 'category',
      newValues: [
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
