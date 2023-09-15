'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('session', 'session_pkey', {
        transaction,
      })

      await queryInterface.renameColumn('session', 'id', 'session_id', {
        transaction,
      })

      await queryInterface.addColumn(
        'session',
        'id',
        {
          type: Sequelize.UUID,
          defaultValue: Sequelize.fn('uuid_generate_v4'),
          allowNull: false,
          primaryKey: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('session', 'id', { transaction })

      await queryInterface.renameColumn('session', 'session_id', 'id', {
        transaction,
      })

      await queryInterface.addConstraint('session', {
        fields: ['id'],
        type: 'primary key',
        name: 'sessions_pkey',
        transaction,
      })
    })
  },
}
