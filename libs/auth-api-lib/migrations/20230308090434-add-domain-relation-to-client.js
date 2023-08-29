'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'client',
        'domain_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )

      const [clients, _] = await queryInterface.sequelize.query(
        'SELECT client_id FROM client',
        {
          transaction,
        },
      )

      for (const { client_id: clientId } of clients) {
        let domainId = clientId.split('/')[0]
        if (domainId && domainId.startsWith('@')) {
          const [domains, _] = await queryInterface.sequelize.query(
            `SELECT name FROM domain WHERE name = '${domainId}'`,
            { transaction },
          )

          if (domains.length > 0) {
            await queryInterface.sequelize.query(
              `UPDATE client SET domain_name = '${domainId}' WHERE client_id = '${clientId}'`,
              {
                transaction,
              },
            )
          }
        }
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('client', 'domain_name')
  },
}
