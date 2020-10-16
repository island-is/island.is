'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'gdpr',
      [
        {
          national_id: '0301665909',
          gdpr_status: true,
          updated_at: '2020-09-08 04:05:06',
        },
        {
          national_id: '0404815409',
          gdpr_status: false,
          updated_at: '2020-09-09 04:05:06',
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('gdpr', null, {})
  },
}
