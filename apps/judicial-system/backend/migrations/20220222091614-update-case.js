'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize
        .query(
          'SELECT id, accused_bookings, litigation_presentations FROM "case"',
          { transaction },
        )
        .then((res) =>
          Promise.all(
            res[0].map(async (c) =>
              queryInterface.sequelize.query(
                `UPDATE "case" SET accused_bookings = ${
                  c.accused_bookings?.trim()
                    ? "'" +
                      c.accused_bookings.trim().replace(/\'/g, "''") +
                      (c.litigation_presentations?.trim()
                        ? '\n\n' +
                          c.litigation_presentations.trim().replace(/\'/g, "''")
                        : '') +
                      "'"
                    : c.litigation_presentations?.trim()
                    ? "'" +
                      c.litigation_presentations.replace(/\'/g, "''") +
                      "'"
                    : null
                } WHERE id = '${c.id}'`,
                { transaction },
              ),
            ),
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.renameColumn(
              'case',
              'accused_bookings',
              'session_bookings',
              { transaction },
            ),
            queryInterface.removeColumn('case', 'litigation_presentations', {
              transaction,
            }),
          ]),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'session_bookings',
          'accused_bookings',
          { transaction },
        ),
        queryInterface.addColumn(
          'case',
          'litigation_presentations',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },
}
