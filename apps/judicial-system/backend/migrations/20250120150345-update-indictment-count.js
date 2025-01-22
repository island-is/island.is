module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'indictment_count',
          'recorded_speed',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'indictment_count',
          'speed_limit',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },
  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('indictment_count', 'recorded_speed', {
          transaction: t,
        }),
        queryInterface.removeColumn('indictment_count', 'speed_limit', {
          transaction: t,
        }),
      ]),
    )
  },
}
