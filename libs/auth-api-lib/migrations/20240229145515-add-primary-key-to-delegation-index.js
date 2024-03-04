'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addConstraint(
        'delegation_index',
        {
          fields: ['to_national_id', 'from_national_id', 'provider', 'type'],
          type: 'primary key',
          name: 'delegation_index_pkey',
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint(
        'delegation_index',
        'delegation_index_pkey',
        { transaction },
      )
    })
  },
}
