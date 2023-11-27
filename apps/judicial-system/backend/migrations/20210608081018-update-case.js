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

function formatProsecutorDemands(
  type,
  accusedNationalId,
  accusedName,
  court,
  requestedValidToDate,
  isolation,
  isExtension,
  previousDecision,
) {
  return `Þess er krafist að ${accusedName}, kt. ${
    accusedNationalId?.length === 10
      ? `${accusedNationalId.slice(0, 6)}-${accusedNationalId.slice(6)}`
      : accusedNationalId
  }, sæti${
    isExtension && previousDecision === 'ACCEPTING' ? ' áframhaldandi' : ''
  } ${
    type === 'CUSTODY' ? 'gæsluvarðhaldi' : 'farbanni'
  } með úrskurði ${court?.replace('Héraðsdómur', 'Héraðsdóms')}, til ${
    requestedValidToDate ? formatDate(requestedValidToDate) : ''
  }${
    type === 'CUSTODY' && isolation
      ? ', og verði gert að sæta einangrun á meðan á varðhaldi stendur'
      : ''
  }.`
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .renameColumn('case', 'other_demands', 'demands', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'SELECT "id", "type", "accused_national_id", "accused_name", "court_id", "requested_valid_to_date", "demands", "requested_custody_restrictions", "parent_case_id" \
               FROM "case"',
              { transaction: t },
            ),
          )
          .then((res) =>
            Promise.all(
              res[0].map(async (c) => {
                const subRes = await Promise.all([
                  queryInterface.sequelize.query(
                    `SELECT "name" \
                     FROM "institution" \
                     WHERE "id" = ${c.court_id ? `'${c.court_id}'` : 'NULL'}`,
                    { transaction: t },
                  ),
                  queryInterface.sequelize.query(
                    `SELECT "decision" \
                     FROM "case" \
                     WHERE "id" = ${
                       c.parent_case_id ? `'${c.parent_case_id}'` : 'NULL'
                     }`,
                    { transaction: t },
                  ),
                ])

                return {
                  id: c.id,
                  type: c.type,
                  accusedNationalId: c.accused_national_id,
                  accusedName: c.accused_name,
                  courtName:
                    subRes[0][0].length === 1 ? subRes[0][0][0].name : '',
                  requestedValidToDate: c.requested_valid_to_date,
                  demands: c.demands,
                  isolation:
                    c.requested_custody_restrictions?.includes('ISOLATION'),
                  isExtension: subRes[1][0].length === 1,
                  previousDecision:
                    subRes[1][0].length === 1
                      ? subRes[1][0][0].decision
                      : undefined,
                }
              }),
            ),
          )
          .then((res) =>
            Promise.all(
              res.map((c) => {
                if (c.requestedValidToDate) {
                  return queryInterface.sequelize.query(
                    `UPDATE "case" \
                     SET "demands" = '${formatProsecutorDemands(
                       c.type,
                       c.accusedNationalId,
                       c.accusedName,
                       c.courtName,
                       c.requestedValidToDate,
                       c.isolation,
                       c.isExtension,
                       c.previousDecision,
                     ).replace(/'/g, "''")}${
                      c.demands ? `\n\n${c.demands.replace(/'/g, "''")}` : ''
                    }' \
                     WHERE "id" = '${c.id}'`,
                    { transaction: t },
                  )
                }
              }),
            ),
          ),
        queryInterface.renameColumn(
          'case',
          'police_demands',
          'prosecutor_demands',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .renameColumn('case', 'demands', 'other_demands', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'SELECT "id", "requested_valid_to_date", "other_demands" \
               FROM "case"',
              { transaction: t },
            ),
          )
          .then((res) =>
            Promise.all(
              res[0].map(async (c) => {
                if (c.requested_valid_to_date) {
                  const idx = c.other_demands?.indexOf('\n\n')

                  return queryInterface.sequelize.query(
                    `UPDATE "case" \
                     SET "other_demands" = ${
                       idx >= 0
                         ? `'${c.other_demands
                             .slice(idx + 2)
                             .replace(/'/g, "''")}'`
                         : 'NULL'
                     } \
                     WHERE "id" = '${c.id}'`,
                    { transaction: t },
                  )
                }
              }),
            ),
          ),
        queryInterface.renameColumn(
          'case',
          'prosecutor_demands',
          'police_demands',
          { transaction: t },
        ),
      ]),
    )
  },
}
