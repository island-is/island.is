module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'defendant',
          'is_defender_choice_confirmed',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'defendant',
          'case_files_shared_with_defender',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'defendant',
          'is_defender_choice_confirmed',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'defendant',
          'case_files_shared_with_defender',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
