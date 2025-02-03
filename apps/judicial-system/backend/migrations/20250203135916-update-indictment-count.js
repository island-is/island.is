'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'indictment_count',
          'offenses',
          'deprecated_offenses',
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
          'deprecated_offenses',
          'offenses',
          { transaction: t },
        ),
      ]),
    )
  },
}
