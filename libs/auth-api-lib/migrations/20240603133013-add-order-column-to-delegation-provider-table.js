'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'delegation_provider',
        'order',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
        UPDATE delegation_provider
        SET "order" = 0
        WHERE id = 'fyrirtaekjaskra';

        UPDATE delegation_provider
        SET "order" = 1
        WHERE id = 'thjodskra';

        UPDATE delegation_provider
        SET "order" = 2
        WHERE id = 'delegationdb';
      `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('delegation_provider', 'order', {
        transaction,
      })
    })
  },
}
