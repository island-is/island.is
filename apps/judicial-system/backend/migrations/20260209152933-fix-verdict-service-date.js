'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'verdict',
        { service_date: '2026-02-01T12:15:00.000Z' },
        { id: '04253fb0-2596-4453-8082-27844644ed7c' },
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
