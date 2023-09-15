'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameTable('file', 'case_file', { transaction: t }),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameTable('case_file', 'file', { transaction: t }),
    )
  },
}
