'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'custody_provisions',
          'legal_provisions',
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE enum_case_custody_provisions RENAME TO enum_case_legal_provisions',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'legal_provisions',
          'custody_provisions',
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          'ALTER TYPE enum_case_legal_provisions RENAME TO enum_case_custody_provisions',
          { transaction: t },
        ),
      ]),
    )
  },
}
