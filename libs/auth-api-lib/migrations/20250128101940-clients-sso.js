'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('client', 'sso', {
      type: Sequelize.ENUM('allow', 'client', 'disabled'),
      allowNull: false,
      defaultValue: 'disabled',
    })

    const [clientDelegationTypes] = await queryInterface.sequelize.query(`
      select distinct on(client_id) *
      from client_delegation_types
    `)

    const clientIds = clientDelegationTypes?.map((client) => client.client_id) || []

    if (!clientIds.length) {
      return
    }

    await queryInterface.bulkUpdate('client', { sso: 'client' }, { client_id: clientIds })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('client', 'sso', { transaction: t },)
      .then(() =>
        queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_client_sso";', { transaction: t })
      )
    )
  }
};
