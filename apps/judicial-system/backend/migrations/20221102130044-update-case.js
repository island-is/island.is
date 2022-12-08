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
        // Indictment cases
        'AGGRAVATED_ASSAULT',
        'ALCOHOL_LAWS', // new
        'ASSAULT_LEADING_TO_DEATH',
        'ATTEMPTED_MURDER',
        'BREAKING_AND_ENTERING', // new
        'CHILD_PROTECTION_LAWS',
        'COVER_UP', // new
        'CUSTOMS_VIOLATION', // new
        'DOMESTIC_VIOLENCE',
        'EMBEZZLEMENT',
        'FRAUD',
        'INDECENT_EXPOSURE', // new
        'INTIMATE_RELATIONS', // new
        'LEGAL_ENFORCEMENT_LAWS', // new
        'LOOTING', // new
        'MAJOR_ASSAULT',
        'MINOR_ASSAULT',
        'MONEY_LAUNDERING', // new
        'MURDER',
        'NARCOTICS_OFFENSE',
        'NAVAL_LAW_VIOLATION', // new
        'OTHER_CRIMINAL_OFFENSES',
        'OTHER_OFFENSES',
        'POLICE_REGULATIONS', // new
        'PROPERTY_DAMAGE',
        'PUBLIC_SERVICE_VIOLATION', // new
        'RAPE',
        'SEXUAL_OFFENSES_OTHER_THAN_RAPE',
        'TAX_VIOLATION',
        'THEFT',
        'THREAT', // new
        'TRAFFIC_VIOLATION',
        'UTILITY_THEFT',
        'WEPONS_VIOLATION', // new
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

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'type',
      newValues: [
        'CHILD_PROTECTION_LAWS',
        'PROPERTY_DAMAGE',
        'NARCOTICS_OFFENSE',
        'EMBEZZLEMENT',
        'FRAUD',
        'DOMESTIC_VIOLENCE',
        'ASSAULT_LEADING_TO_DEATH',
        'MURDER',
        'MAJOR_ASSAULT',
        'MINOR_ASSAULT',
        'RAPE',
        'UTILITY_THEFT',
        'AGGRAVATED_ASSAULT',
        'TAX_VIOLATION',
        'ATTEMPTED_MURDER',
        'TRAFFIC_VIOLATION',
        'THEFT',
        'OTHER_CRIMINAL_OFFENSES',
        'SEXUAL_OFFENSES_OTHER_THAN_RAPE',
        'OTHER_OFFENSES',
        'CUSTODY',
        'TRAVEL_BAN',
        'ADMISSION_TO_FACILITY',
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
        'EXPULSION_FROM_HOME',
        'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME', // new value
        'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
        'VIDEO_RECORDING_EQUIPMENT',
        'OTHER',
      ],
      enumName: 'enum_case_type',
    })
  },
}
