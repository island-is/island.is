'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          'SELECT id, court_documents FROM "case" WHERE court_documents IS NOT NULL',
          { transaction: t },
        )
        .then((res) => {
          queryInterface.removeColumn('case', 'court_documents', {
            transaction: t,
          })

          return res
        })
        .then((res) => {
          queryInterface.addColumn(
            'case',
            'court_documents',
            {
              type: Sequelize.ARRAY(Sequelize.JSON),
              allowNull: true,
            },
            { transaction: t },
          )

          return res
        })
        .then((res) =>
          Promise.all(
            res[0].map((c) =>
              queryInterface.sequelize.query(
                `UPDATE "case" SET court_documents = '{${c.court_documents.reduce(
                  (acc, d, i) =>
                    acc +
                    (i === 0 ? '"' : ',"') +
                    JSON.stringify({ name: d })
                      .replace(/\\/g, '\\\\')
                      .replace(/"/g, '\\"') +
                    '"',
                  '',
                )}}' WHERE id = '${c.id}'`,
                { transaction: t },
              ),
            ),
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          'SELECT id, court_documents FROM "case" WHERE court_documents IS NOT NULL',
          { transaction: t },
        )
        .then((res) => {
          queryInterface.removeColumn('case', 'court_documents', {
            transaction: t,
          })

          return res
        })
        .then((res) => {
          queryInterface.addColumn(
            'case',
            'court_documents',
            {
              type: Sequelize.ARRAY(Sequelize.STRING),
              allowNull: true,
            },
            { transaction: t },
          )
          return res
        })
        .then((res) =>
          Promise.all(
            res[0].map((c) =>
              queryInterface.sequelize.query(
                `UPDATE "case" SET court_documents = '{${c.court_documents.reduce(
                  (acc, d, i) =>
                    acc +
                    (i === 0 ? '"' : ',"') +
                    d.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"') +
                    '"',
                  '',
                )}}' WHERE id = '${c.id}'`,
                { transaction: t },
              ),
            ),
          ),
        ),
    )
  },
}
