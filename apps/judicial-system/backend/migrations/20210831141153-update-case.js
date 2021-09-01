'use strict'

const dayOfWeek = [
  'sunnudagsins',
  'mánudagsins',
  'þriðjudagsins',
  'miðvikudagsins',
  'fimmtudagsins',
  'föstudagsins',
  'laugardagsins',
]

const month = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
]

function formatDate(date) {
  return `${dayOfWeek[date.getDay()]} ${date.getDate()}. ${
    month[date.getMonth()]
  } ${date.getFullYear()}, kl. ${('0' + date.getHours()).substr(-2)}:${(
    '00' + date.getMinutes()
  ).substr(-2)}`
}

function formatAccusedByGender(accusedGender) {
  switch (accusedGender) {
    case 'MALE':
      return 'kærði'
    case 'FEMALE':
      return 'kærða'
    case 'OTHER':
    default:
      return 'kærða'
  }
}

const capitalize = (text) => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

const formatNationalId = (nationalId) => {
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

function formatConclusion(
  type,
  accusedNationalId,
  accusedName,
  accusedGender,
  decision,
  validToDate,
  isolation,
  isExtension,
  previousDecision,
  isolationToDate,
) {
  const isolationEndsBeforeValidToDate =
    validToDate && isolationToDate && validToDate > isolationToDate

  return decision === 'REJECTING'
    ? `Kröfu um að ${formatAccusedByGender(
        accusedGender,
      )}, ${accusedName}, kt. ${formatNationalId(accusedNationalId)}, sæti${
        isExtension && previousDecision === 'ACCEPTING' ? ' áframhaldandi' : ''
      } ${type === 'CUSTODY' ? 'gæsluvarðhaldi' : 'farbanni'} er hafnað.`
    : `${capitalize(
        formatAccusedByGender(accusedGender),
      )}, ${accusedName}, kt. ${formatNationalId(
        accusedNationalId,
      )}, skal sæta ${
        decision === 'ACCEPTING'
          ? `${
              isExtension && previousDecision === 'ACCEPTING'
                ? 'áframhaldandi '
                : ''
            }${type === 'CUSTODY' ? 'gæsluvarðhaldi' : 'farbanni'}`
          : // decision === 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN'
            `${
              isExtension &&
              previousDecision === 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN'
                ? 'áframhaldandi '
                : ''
            }farbanni`
      }, þó ekki lengur en til ${formatDate(validToDate, 'PPPPp')
        ?.replace('dagur,', 'dagsins')
        ?.replace(' kl.', ', kl.')}.${
        decision === 'ACCEPTING' && isolation
          ? ` ${capitalize(
              formatAccusedByGender(accusedGender),
            )} skal sæta einangrun ${
              isolationEndsBeforeValidToDate
                ? `ekki lengur en til ${formatDate(isolationToDate, 'PPPPp')
                    ?.replace('dagur,', 'dagsins')
                    ?.replace(' kl.', ', kl.')}.`
                : 'á meðan á gæsluvarðhaldinu stendur.'
            }`
          : ''
      }`
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize
          .query(
            `SELECT "id", "type", "accused_national_id", "accused_name", "accused_gender", "decision", "valid_to_date", "custody_restrictions", "isolation_to_date", "conclusion", "parent_case_id" \
           FROM "case" \
           WHERE "type" IN ('CUSTODY', 'TRAVEL_BAN') AND "state" IN ('ACCEPTED', 'REJECTED')`,
            { transaction: t },
          )
          .then((res) =>
            Promise.all(
              res[0].map(async (c) => {
                const subRes = await queryInterface.sequelize.query(
                  `SELECT "decision" \
                   FROM "case" \
                   WHERE "id" = ${
                     c.parent_case_id ? `'${c.parent_case_id}'` : 'NULL'
                   }`,
                  { transaction: t },
                )

                return {
                  id: c.id,
                  type: c.type,
                  accusedNationalId: c.accused_national_id,
                  accusedName: c.accused_name,
                  accusedGender: c.accused_gender,
                  decision: c.decision,
                  validToDate: c.valid_to_date,
                  isolation: c.custody_restrictions?.includes('ISOLATION'),
                  conclusion: c.conclusion,
                  isExtension: subRes[0].length === 1,
                  previousDecision:
                    subRes[0].length === 1 ? subRes[0][0].decision : undefined,
                }
              }),
            ),
          )
          .then((res) =>
            Promise.all(
              res.map((c) => {
                return queryInterface.sequelize.query(
                  `UPDATE "case" \
                 SET "conclusion" = '${formatConclusion(
                   c.type,
                   c.accusedNationalId,
                   c.accusedName,
                   c.accusedGender,
                   c.decision,
                   c.validToDate,
                   c.isolation,
                   c.isExtension,
                   c.previousDecision,
                   c.isolationToDate,
                 ).replace(/'/g, "''")}${
                    c.conclusion
                      ? `\n\n${c.conclusion.replace(/'/g, "''")}`
                      : ''
                  }' \
                 WHERE "id" = '${c.id}'`,
                  { transaction: t },
                )
              }),
            ),
          ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          `SELECT "id", "conclusion" \
           FROM "case" \
           WHERE "type" IN ('CUSTODY', 'TRAVEL_BAN') AND "state" IN ('ACCEPTED', 'REJECTED')`,
          { transaction: t },
        )
        .then((res) =>
          Promise.all(
            res[0].map(async (c) => {
              const idx = c.conclusion?.indexOf('\n\n')

              return queryInterface.sequelize.query(
                `UPDATE "case" \
                   SET "conclusion" = ${
                     idx >= 0
                       ? `'${c.conclusion.slice(idx + 2).replace(/'/g, "''")}'`
                       : 'NULL'
                   } \
                   WHERE "id" = '${c.id}'`,
                { transaction: t },
              )
            }),
          ),
        ),
    )
  },
}
