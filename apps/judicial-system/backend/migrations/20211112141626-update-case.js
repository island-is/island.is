'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'type',
      newValues: [
        'CUSTODY',
        'TRAVEL_BAN',
        'SEARCH_WARRANT',
        'BANKING_SECRECY_WAIVER',
        'PHONE_TAPPING',
        'TELECOMMUNICATIONS',
        'TRACKING_EQUIPMENT',
        'PSYCHIATRIC_EXAMINATION',
        'SOUND_RECORDING_EQUIPMENT',
        'AUTOPSY',
        'BODY_SEARCH',
        'INTERNET_USAGE',
        'RESTRAINING_ORDER',
        'OTHER',
      ],
      enumName: 'enum_case_type',
    })
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'type',
      newValues: [
        'CUSTODY',
        'TRAVEL_BAN',
        'SEARCH_WARRANT',
        'BANKING_SECRECY_WAIVER',
        'PHONE_TAPPING',
        'TELECOMMUNICATIONS',
        'TRACKING_EQUIPMENT',
        'PSYCHIATRIC_EXAMINATION',
        'SOUND_RECORDING_EQUIPMENT',
        'AUTOPSY',
        'BODY_SEARCH',
        'INTERNET_USAGE',
        'OTHER',
      ],
      enumName: 'enum_case_type',
    })
  },
}
