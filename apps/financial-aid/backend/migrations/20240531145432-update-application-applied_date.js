'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn('applications', 'applied', 'applied_date', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn('applications', 'applied_date', 'applied', {
          transaction: t,
        }),
      ]),
    )
  },
}
