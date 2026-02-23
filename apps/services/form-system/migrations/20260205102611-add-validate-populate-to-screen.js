module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'screen',
        'should_validate',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'screen',
        'should_populate',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('screen', 'should_validate', {
        transaction: t,
      })

      await queryInterface.removeColumn('screen', 'should_populate', {
        transaction: t,
      })
    })
  },
}
