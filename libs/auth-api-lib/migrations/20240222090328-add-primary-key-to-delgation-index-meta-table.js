'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addConstraint('delegation_index_meta', {
        fields: ['national_id'],
        type: 'primary key',
        name: 'national_id_pkey',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint(
        'delegation_index_meta',
        'national_id_pkey',
        { transaction },
      )
    })
  },
}
