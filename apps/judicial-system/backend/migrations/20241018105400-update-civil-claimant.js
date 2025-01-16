module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'civil_claimant',
        'is_spokesperson_confirmed',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn(
        'civil_claimant',
        'is_spokesperson_confirmed',
        {
          transaction: t,
        },
      ),
    )
  },
}
