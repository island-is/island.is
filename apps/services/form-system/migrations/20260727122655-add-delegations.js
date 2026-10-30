module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'organization',
        'delegations',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'form',
        'delegations',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('organization', 'delegations', {
        transaction: t,
      })

      await queryInterface.removeColumn('form', 'delegations', {
        transaction: t,
      })
    })
  },
}
