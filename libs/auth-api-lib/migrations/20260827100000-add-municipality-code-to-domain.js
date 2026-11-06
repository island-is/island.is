module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'domain',
        'municipality_code',
        {
          type: Sequelize.STRING,
          allowNull: true,
          comment:
            'Municipality number (sveitarfélagsnúmer, e.g. "0000" for Reykjavíkurborg), used to match users to their municipality domain via the National Registry legal domicile code',
        },
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('domain', 'municipality_code', {
        transaction,
      })
    })
  },
}
