'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'indictment_count',
          'offenses',
          'deprecatedOffenses',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'indictment_count',
          'deprecatedOffenses',
          'offenses',
          { transaction: t },
        ),
      ]),
    )
  },
}
