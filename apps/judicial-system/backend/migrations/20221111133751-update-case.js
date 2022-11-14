'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      queryInterface
        .addColumn(
          'case',
          'indictment_sub_types',
          { type: Sequelize.JSON, allowNull: true },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `SELECT id, indictment_sub_type, police_case_numbers FROM "case"
             WHERE type = 'INDICTMENT' AND
                   indictment_sub_type IS NOT NULL AND
                   police_case_numbers IS NOT NULL`,
            { transaction },
          ),
        )
        .then(async ([cases]) => {
          for (const theCase of cases) {
            if (theCase.police_case_numbers.length === 0) {
              continue
            }

            await queryInterface.bulkUpdate(
              'case',
              {
                indictment_sub_types: {
                  [theCase.police_case_numbers[0]]: [
                    theCase.indictment_sub_type,
                  ],
                },
              },
              { id: [theCase.id] },
              { transaction },
            )
          }
        })
        .then(() =>
          queryInterface.removeColumn('case', 'indictment_sub_type', {
            transaction,
          }),
        )
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_case_indictment_sub_type',
            { transaction },
          ),
        ),
    )
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      queryInterface
        .addColumn(
          'case',
          'indictment_sub_type',
          {
            type: Sequelize.ENUM(
              'AGGRAVATED_ASSAULT',
              'ALCOHOL_LAWS',
              'ASSAULT_LEADING_TO_DEATH',
              'ATTEMPTED_MURDER',
              'BREAKING_AND_ENTERING',
              'CHILD_PROTECTION_LAWS',
              'COVER_UP',
              'CUSTOMS_VIOLATION',
              'DOMESTIC_VIOLENCE',
              'EMBEZZLEMENT',
              'FRAUD',
              'INDECENT_EXPOSURE',
              'INTIMATE_RELATIONS',
              'LEGAL_ENFORCEMENT_LAWS',
              'LOOTING',
              'MAJOR_ASSAULT',
              'MINOR_ASSAULT',
              'MONEY_LAUNDERING',
              'MURDER',
              'NARCOTICS_OFFENSE',
              'NAVAL_LAW_VIOLATION',
              'OTHER_CRIMINAL_OFFENSES',
              'OTHER_OFFENSES',
              'POLICE_REGULATIONS',
              'PROPERTY_DAMAGE',
              'PUBLIC_SERVICE_VIOLATION',
              'RAPE',
              'SEXUAL_OFFENSES_OTHER_THAN_RAPE',
              'TAX_VIOLATION',
              'THEFT',
              'THREAT',
              'TRAFFIC_VIOLATION',
              'UTILITY_THEFT',
              'WEPONS_VIOLATION',
            ),
            allowNull: true,
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `SELECT id, indictment_sub_types FROM "case"
             WHERE type = 'INDICTMENT' AND indictment_sub_types IS NOT NULL`,
            { transaction },
          ),
        )
        .then(async ([cases]) => {
          for (const theCase of cases) {
            let indictmentSubType = null
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [_, value] of Object.entries(
              theCase.indictment_sub_types,
            )) {
              if (value && value.length > 0) {
                indictmentSubType = value[0]
                break
              }
            }

            await queryInterface.bulkUpdate(
              'case',
              { indictment_sub_type: indictmentSubType },
              { id: [theCase.id] },
              { transaction },
            )
          }
        })
        .then(() =>
          queryInterface.removeColumn('case', 'indictment_sub_types', {
            transaction,
          }),
        ),
    )
  },
}
