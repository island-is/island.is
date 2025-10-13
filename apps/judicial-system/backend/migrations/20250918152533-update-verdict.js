'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'verdict',
          'defender_national_id',
          'delivered_to_defender_national_id',
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
          'verdict',
          'delivered_to_defender_national_id',
          'defender_national_id',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
