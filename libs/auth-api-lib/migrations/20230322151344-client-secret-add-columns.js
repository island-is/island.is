'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'client_secret',
        'id',
        {
          type: Sequelize.STRING,
          defaultValue: Sequelize.fn('uuid_generate_v4'),
          allowNull: false,
          primaryKey: true,
        },
        { transaction },
      )

      await queryInterface.addColumn(
        'client_secret',
        'encrypted_value',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )

      await queryInterface.removeConstraint(
        'client_secret',
        'client_secret_pkey',
        { transaction },
      )

      await queryInterface.addConstraint('client_secret', {
        fields: ['id'],
        type: 'primary key',
        name: 'client_secret_pkey',
        transaction,
      })

      await queryInterface.addConstraint('client_secret', {
        fields: ['client_id', 'value'],
        type: 'unique',
        name: 'client_secret_unique',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('client_secret', 'id', {
        transaction,
      })

      await queryInterface.removeColumn('client_secret', 'encrypted_value', {
        transaction,
      })

      await queryInterface.removeConstraint(
        'client_secret',
        'client_secret_unique',
        { transaction },
      )

      await queryInterface.addConstraint('client_secret', {
        fields: ['client_id', 'value'],
        type: 'primary key',
        name: 'client_secret_pkey',
        transaction,
      })
    })
  },
}
