'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'defendant',
          'defender_choice',
          {
            type: Sequelize.ENUM('WAIVE', 'CHOOSE', 'DELAY', 'DELEGATE'),
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "defendant" SET defender_choice = 'WAIVE' where defendant_waives_right_to_counsel = true;`,
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
            `UPDATE "defendant" SET defendant_waives_right_to_counsel = true where defender_choice = 'WAIVE';`,
            { transaction: t },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.removeColumn('defendant', 'defender_choice', {
              transaction: t,
            }),
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_defendant_defender_choice"',
              { transaction: t },
            ),
          ]),
        ),
    )
  },
}
