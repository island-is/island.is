'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'verdict',
        { service_date: '2026-01-17T11:06:31.333Z' },
        { id: 'aff76166-defd-46b0-84f8-31b0dced6085' },
        { transaction },
      ),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
