'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .renameColumn('case', 'ruling_date', 'ruling_signature_date', {
          transaction,
        })
        .then(() =>
          queryInterface.addColumn(
            'case',
            'ruling_date',
            { type: Sequelize.DATE, allowNull: true },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" SET ruling_date = court_end_time
             WHERE type != 'INDICTMENT' AND state in ('ACCEPTED', 'REJECTED', 'DELETED')`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" SET ruling_date = COALESCE(ruling_signature_date, modified),
                               ruling_signature_date = NULL
             WHERE type = 'INDICTMENT' AND state in ('ACCEPTED', 'REJECTED', 'DELETED')`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .removeColumn('case', 'ruling_date', { transaction })
        .then(() =>
          queryInterface.renameColumn(
            'case',
            'ruling_signature_date',
            'ruling_date',
            { transaction },
          ),
        ),
    )
  },
}
