'use strict'

// Per-party withdrawal of an in-court ruling-order appeal. When a party that
// appealed in court (decision = APPEAL) withdraws, its decision row is stamped
// with the withdrawal time; the appeal stands until every appealing party has
// withdrawn. NULL = not withdrawn.
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'appeal_decision',
        'withdrawn_date',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('appeal_decision', 'withdrawn_date', {
        transaction: t,
      }),
    )
  },
}
