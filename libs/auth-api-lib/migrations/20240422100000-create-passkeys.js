'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'passkey',
        {
          passkey_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          public_key: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          user_sub: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
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

      await queryInterface.addIndex('passkey', ['passkey_id'], { transaction })
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('passkey', { transaction })
    })
  },
}
