'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'passkey',
        'counter',
        {
          // Why BIGINT?
          // https://simplewebauthn.dev/docs/packages/server#additional-data-structures
          // "SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters"
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('passkey', 'counter', {
        transaction,
      })
    })
  },
}
