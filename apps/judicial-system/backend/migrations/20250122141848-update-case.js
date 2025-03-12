'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'type',
      newValues: [
        // Indictment cases
        'INDICTMENT',
        // Restriction Cases
        'ADMISSION_TO_FACILITY',
        'CUSTODY',
        'TRAVEL_BAN',
        // Investigation Cases
        'AUTOPSY',
        'BANKING_SECRECY_WAIVER',
        'BODY_SEARCH',
        'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
        'EXPULSION_FROM_HOME',
        'INTERNET_USAGE',
        'OTHER',
        'PHONE_TAPPING',
        'PAROLE_REVOCATION',
        'PSYCHIATRIC_EXAMINATION',
        'RESTRAINING_ORDER',
        'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME',
        'SEARCH_WARRANT',
        'STATEMENT_FROM_MINOR',
        'STATEMENT_IN_COURT',
        'SOUND_RECORDING_EQUIPMENT',
        'TELECOMMUNICATIONS',
        'TRACKING_EQUIPMENT',
        'VIDEO_RECORDING_EQUIPMENT',
      ],
      enumName: 'enum_case_type',
    })
  },

  down: (queryInterface) => {
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'type',
      newValues: [
        // Indictment cases
        'INDICTMENT',
        // Restriction Cases
        'ADMISSION_TO_FACILITY',
        'CUSTODY',
        'TRAVEL_BAN',
        // Investigation Cases
        'AUTOPSY',
        'BANKING_SECRECY_WAIVER',
        'BODY_SEARCH',
        'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
        'EXPULSION_FROM_HOME',
        'INTERNET_USAGE',
        'OTHER',
        'PHONE_TAPPING',
        'PAROLE_REVOCATION',
        'PSYCHIATRIC_EXAMINATION',
        'RESTRAINING_ORDER',
        'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME',
        'SEARCH_WARRANT',
        'SOUND_RECORDING_EQUIPMENT',
        'TELECOMMUNICATIONS',
        'TRACKING_EQUIPMENT',
        'VIDEO_RECORDING_EQUIPMENT',
      ],
      enumName: 'enum_case_type',
    })
  },
}
