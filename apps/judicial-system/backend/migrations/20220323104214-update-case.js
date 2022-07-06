'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'origin',
          {
            type: Sequelize.ENUM('UNKNOWN', 'RVG', 'LOKE'),
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.bulkUpdate(
            'case',
            { origin: 'UNKNOWN' },
            {},
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            'ALTER TABLE "case" ALTER COLUMN origin SET NOT NULL',
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'origin', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_case_origin',
            { transaction: t },
          ),
        ),
    )
  },
}
