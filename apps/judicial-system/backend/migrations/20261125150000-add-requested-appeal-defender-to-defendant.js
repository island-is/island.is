'use strict'

// Citizen wish for CoA counsel (mailbox), separate from court-settled
// appeal_defender_* columns — same split as requested_defender_* vs defender_*.
const columns = [
  ['requested_appeal_defender_choice', 'STRING'],
  ['requested_appeal_defender_national_id', 'STRING'],
  ['requested_appeal_defender_name', 'STRING'],
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        columns.map(([name, type]) =>
          queryInterface.addColumn(
            'defendant',
            name,
            { type: Sequelize[type], allowNull: true },
            { transaction: t },
          ),
        ),
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        columns.map(([name]) =>
          queryInterface.removeColumn('defendant', name, { transaction: t }),
        ),
      ),
    )
  },
}
