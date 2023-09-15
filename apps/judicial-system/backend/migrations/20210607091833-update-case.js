'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'requested_custody_end_date',
          'requested_valid_to_date',
          { transaction: t },
        ),
        queryInterface.renameColumn(
          'case',
          'custody_end_date',
          'valid_to_date',
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
          'case',
          'requested_valid_to_date',
          'requested_custody_end_date',
          { transaction: t },
        ),
        queryInterface.renameColumn(
          'case',
          'valid_to_date',
          'custody_end_date',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
