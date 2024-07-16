module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('defendant', 'accept_compensation_claim', {
        transaction: t,
      }),
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'defendant',
        'accept_compensation_claim',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
