'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface) {
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: [
        'PROSECUTOR',
        'PROSECUTOR_REPRESENTATIVE',
        'JUDGE',
        'REGISTRAR',
        'ASSISTANT',
        'DISTRICT_COURT_JUDGE',
        'DISTRICT_COURT_REGISTRAR',
        'DISTRICT_COURT_ASSISTANT',
        'COURT_OF_APPEALS_JUDGE',
        'COURT_OF_APPEALS_REGISTRAR',
        'COURT_OF_APPEALS_ASSISTANT',
        'PRISON_SYSTEM_STAFF',
        'PUBLIC_PROSECUTOR', // new value
        'PUBLIC_PROSECUTOR_STAFF', // new value
      ],
    })
  },

  async down(queryInterface) {
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: [
        'PROSECUTOR',
        'PROSECUTOR_REPRESENTATIVE',
        'JUDGE',
        'REGISTRAR',
        'ASSISTANT',
        'DISTRICT_COURT_JUDGE',
        'DISTRICT_COURT_REGISTRAR',
        'DISTRICT_COURT_ASSISTANT',
        'COURT_OF_APPEALS_JUDGE',
        'COURT_OF_APPEALS_REGISTRAR',
        'COURT_OF_APPEALS_ASSISTANT',
        'PRISON_SYSTEM_STAFF',
      ],
    })
  },
}
