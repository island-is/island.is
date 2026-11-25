'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case',
          'archive_not_before',
          { type: Sequelize.DATE, allowNull: true },
          { transaction },
        )
        .then(() =>
          // A case can be archived more than once, and a restore reads the
          // latest archive of one case
          queryInterface.addIndex('case_archive', ['case_id', 'created'], {
            name: 'case_archive_case_id_created_idx',
            transaction,
          }),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .removeIndex('case_archive', 'case_archive_case_id_created_idx', {
          transaction,
        })
        .then(() =>
          queryInterface.removeColumn('case', 'archive_not_before', {
            transaction,
          }),
        ),
    )
  },
}
