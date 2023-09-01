'use strict'

const formatCustodyRestrictions = (custodyRestrictions) => {
  const guidance =
    'Dómari bendir á að varnaraðila er heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.'

  const caseCustodyRestrictions = [
    {
      id: 'a',
      type: 'NECESSITIES',
    },
    {
      id: 'c',
      type: 'VISITAION',
    },
    {
      id: 'd',
      type: 'COMMUNICATION',
    },
    {
      id: 'e',
      type: 'MEDIA',
    },
    {
      id: 'f',
      type: 'WORKBAN',
    },
  ]

  const relevantCustodyRestrictions = caseCustodyRestrictions
    .filter((restriction) => custodyRestrictions?.includes(restriction.type))
    .sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })

  if (
    !(relevantCustodyRestrictions && relevantCustodyRestrictions.length > 0)
  ) {
    return guidance
  }

  const custodyRestrictionSuffix = (index) => {
    const isNextLast = index === relevantCustodyRestrictions.length - 2
    const isLast = index === relevantCustodyRestrictions.length - 1
    const isOnly = relevantCustodyRestrictions.length === 1

    return isOnly ? 'lið ' : isLast ? 'liðum ' : isNextLast ? ' og ' : ', '
  }

  const filteredCustodyRestrictionsAsString =
    relevantCustodyRestrictions.reduce((res, custodyRestriction, index) => {
      const { id } = custodyRestriction
      const suffix = custodyRestrictionSuffix(index)

      return (res += `${id}-${suffix}`)
    }, '')

  return `Sækjandi kynnir kærða tilhögun gæsluvarðhaldsins, sem sé með takmörkunum skv. ${filteredCustodyRestrictionsAsString}1. mgr. 99. gr. laga nr. 88/2008.\n\n${guidance}`
}

const formatTravelBanRestrictions = (
  accusedGender,
  custodyRestrictions,
  otherRestrictions,
) => {
  const guidance =
    'Dómari bendir á að varnaraðila er heimilt að bera atriði er lúta að framkvæmd farbannsins undir dómara.'

  const relevantCustodyRestrictions = custodyRestrictions?.filter(
    (restriction) =>
      [
        'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
        'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
      ].includes(restriction),
  )

  const hasTravelBanRestrictions =
    relevantCustodyRestrictions && relevantCustodyRestrictions?.length > 0
  const hasOtherRestrictions = otherRestrictions && otherRestrictions.length > 0

  // No restrictions
  if (!hasTravelBanRestrictions && !hasOtherRestrictions) {
    return guidance
  }

  const accusedGenderText = accusedGender === 'FEMALE' ? 'kærðu' : 'kærða'

  const travelBanRestrictionsText = hasTravelBanRestrictions
    ? `Sækjandi tekur fram að farbannið verði með takmörkunum.${
        relevantCustodyRestrictions?.includes(
          'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
        )
          ? ` Að ${accusedGenderText} verði gert að tilkynna sig.`
          : ''
      }${
        relevantCustodyRestrictions?.includes(
          'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
        )
          ? ` Að ${accusedGenderText} verði gert að afhenda vegabréfið sitt.`
          : ''
      }`
    : ''

  const paragraphBreak =
    hasTravelBanRestrictions && hasOtherRestrictions ? '\n' : ''

  const otherRestrictionsText = hasOtherRestrictions ? otherRestrictions : ''

  return `${travelBanRestrictionsText}${paragraphBreak}${otherRestrictionsText}\n\n${guidance}`
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'end_of_session_bookings',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'is_custody_isolation',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
      ])
        .then(() =>
          Promise.all([
            queryInterface.sequelize
              .query(
                `SELECT id, custody_restrictions FROM "case" WHERE "type" = 'CUSTODY' AND decision in ('ACCEPTING', 'ACCEPTING_PARTIALLY')`,
                { transaction: t },
              )
              .then((res) =>
                Promise.all([
                  res[0].map((c) =>
                    queryInterface.sequelize.query(
                      `UPDATE "case" set end_of_session_bookings = '${formatCustodyRestrictions(
                        c.custody_restrictions,
                      )}', is_custody_isolation = ${
                        c.custody_restrictions?.includes('ISOLATION') ?? false
                      } WHERE id = '${c.id}'`,
                      { transaction: t },
                    ),
                  ),
                ]),
              ),
            queryInterface.sequelize
              .query(
                `SELECT id, accused_gender, custody_restrictions, other_restrictions FROM "case" WHERE ("type" = 'CUSTODY' AND decision = 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN' OR "type" = 'TRAVEL_BAN' AND decision in ('ACCEPTING', 'ACCEPTING_PARTIALLY'))`,
                { transaction: t },
              )
              .then((res) =>
                Promise.all([
                  res[0].map((c) =>
                    queryInterface.sequelize.query(
                      `UPDATE "case" set end_of_session_bookings = '${formatTravelBanRestrictions(
                        c.accused_gender,
                        c.custody_restrictions,
                        c.other_restrictions,
                      )}' WHERE id = '${c.id}'`,
                      { transaction: t },
                    ),
                  ),
                ]),
              ),
          ]),
        )
        .then(() =>
          Promise.all([
            queryInterface.removeColumn('case', 'custody_restrictions', {
              transaction: t,
            }),
            queryInterface.removeColumn('case', 'other_restrictions', {
              transaction: t,
            }),
          ]),
        ),
    )
  },

  // Revert results in loss of information
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize.query(
          'ALTER TABLE "case" ADD COLUMN "custody_restrictions" "enum_case_custody_restrictions"[];',
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'other_restrictions',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.removeColumn('case', 'end_of_session_bookings', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'is_custody_isolation', {
          transaction: t,
        }),
      ]),
    )
  },
}
