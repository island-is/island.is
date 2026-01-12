'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'subpoena',
          'subpoena_id',
          'police_subpoena_id',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'subpoena',
          'police_subpoena_id',
          'subpoena_id',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
