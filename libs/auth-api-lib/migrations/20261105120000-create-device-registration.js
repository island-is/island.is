'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'device_registration',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          national_id: { type: Sequelize.STRING, allowNull: false },
          user_sub: { type: Sequelize.STRING, allowNull: false },
          client_id: { type: Sequelize.STRING, allowNull: false },
          install_key_jwk: { type: Sequelize.TEXT, allowNull: false },
          install_key_thumbprint: { type: Sequelize.STRING, allowNull: false },
          biometric_key_jwk: { type: Sequelize.TEXT, allowNull: true },
          biometric_key_thumbprint: { type: Sequelize.STRING, allowNull: true },
          platform: { type: Sequelize.STRING, allowNull: false },
          app_attest_key_id: { type: Sequelize.STRING, allowNull: true },
          app_attest_public_key: { type: Sequelize.TEXT, allowNull: true },
          app_attest_counter: { type: Sequelize.BIGINT, allowNull: true },
          device_name: { type: Sequelize.STRING, allowNull: true },
          login_idp: { type: Sequelize.STRING, allowNull: false },
          audkenni_sim_number: { type: Sequelize.STRING, allowNull: true },
          last_used: { type: Sequelize.DATE, allowNull: false },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: { type: Sequelize.DATE },
        },
        { transaction },
      )

      // One app login per person per client.
      await queryInterface.addIndex(
        'device_registration',
        ['national_id', 'client_id'],
        {
          unique: true,
          name: 'device_registration_national_id_client_id_idx',
          transaction,
        },
      )

      await queryInterface.addIndex(
        'device_registration',
        ['client_id', 'install_key_thumbprint'],
        {
          unique: true,
          name: 'device_registration_client_id_install_key_idx',
          transaction,
        },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('device_registration', { transaction })
    })
  },
}
