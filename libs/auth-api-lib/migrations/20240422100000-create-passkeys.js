'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'passkey',
        {
          passkey_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          public_key: {
            type: Sequelize.BLOB,
            allowNull: false,
          },
          user_sub: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          idp: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          audkenni_sim_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.addConstraint('passkey', {
        fields: ['user_sub', 'type'], // Only possible to have one passkey of each type per user
        type: 'unique',
        name: 'passkey_primary_key',
        transaction,
      })

      await queryInterface.addIndex('passkey', ['user_sub', 'type'], {
        name: 'passkey_user_sub_type_idx',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('passkey', { transaction })
    })
  },
}
