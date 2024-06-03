module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'defendant',
          'defender_choice',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "defendant" SET defender_choice = 'WAIVE' WHERE defendant_waives_right_to_counsel = true;`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn(
            'defendant',
            'defendant_waives_right_to_counsel',
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'defendant',
          'defendant_waives_right_to_counsel',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "defendant" SET defendant_waives_right_to_counsel = true WHERE defender_choice = 'WAIVE';`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('defendant', 'defender_choice', {
            transaction: t,
          }),
        ),
    )
  },
}
