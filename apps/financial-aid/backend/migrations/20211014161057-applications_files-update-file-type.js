'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn('application_files', 'type', {
          type: Sequelize.TEXT,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize
          .query('drop type type', { transaction: t })
          .then(() =>
            queryInterface.changeColumn('application_files', 'type', {
              type: Sequelize.ENUM(
                'Income', 'TaxReturn', 'Other', 'SpouseFiles'
              ),
            }),
          ),
      ]),
    )
  },
}
