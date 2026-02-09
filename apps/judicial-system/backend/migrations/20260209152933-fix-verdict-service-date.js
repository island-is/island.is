'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'verdict',
        { service_date: '2026-02-01T12:15:00.000Z' },
        { id: '83c2fdcb-417b-4891-a1e0-4d0f3a731841' },
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
