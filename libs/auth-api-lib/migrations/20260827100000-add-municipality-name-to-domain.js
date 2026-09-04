module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'domain',
        'municipality_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
          comment:
            'Municipality name as returned by the National Registry (e.g. "Reykjavík"), used to match users to their municipality domain',
        },
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('domain', 'municipality_name', {
        transaction,
      })
    })
  },
}
