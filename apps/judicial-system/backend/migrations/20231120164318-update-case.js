'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          'SELECT id, court_documents FROM "case" WHERE court_documents IS NOT NULL',
          { transaction: t },
        )
        .then((res) =>
          Promise.all(
            res[0].map((c) => {
              const fix = c.court_documents.reduce(
                (acc, d, i) =>
                  acc +
                  (i === 0 ? '"' : ',"') +
                  JSON.stringify({
                    name: d.name,
                    submittedBy:
                      d.submittedBy === 'JUDGE'
                        ? 'DISTRICT_COURT_JUDGE'
                        : d.submittedBy,
                  })
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "''") +
                  '"',
                '',
              )

              return queryInterface.sequelize.query(
                `UPDATE "case" SET court_documents = '{${fix}}' WHERE id = '${c.id}'`,
                { transaction: t },
              )
            }),
          ),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          'SELECT id, court_documents FROM "case" WHERE court_documents IS NOT NULL',
          { transaction: t },
        )
        .then((res) =>
          Promise.all(
            res[0].map((c) => {
              const fix = c.court_documents.reduce(
                (acc, d, i) =>
                  acc +
                  (i === 0 ? '"' : ',"') +
                  JSON.stringify({
                    name: d.name,
                    submittedBy:
                      d.submittedBy === 'DISTRICT_COURT_JUDGE'
                        ? 'JUDGE'
                        : d.submittedBy,
                  })
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "''") +
                  '"',
                '',
              )

              return queryInterface.sequelize.query(
                `UPDATE "case" SET court_documents = '{${fix}}' WHERE id = '${c.id}'`,
                { transaction: t },
              )
            }),
          ),
        ),
    )
  },
}
