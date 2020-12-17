'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'alternative_travel_ban',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface
          .addColumn(
            'case',
            'decision',
            {
              type: Sequelize.ENUM(
                'ACCEPTING',
                'REJECTING',
                'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
              ),
              allowNull: true,
            },
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              `UPDATE "case" SET decision = 'REJECTING' WHERE rejecting;
               UPDATE "case" SET decision = 'ACCEPTING' WHERE NOT COALESCE(rejecting, FALSE) AND state IN ('SUBMITTED', 'ACCEPTED', 'REJECTED');`,
              { transaction: t },
            ),
          )
          .then(() =>
            queryInterface.removeColumn('case', 'rejecting', {
              transaction: t,
            }),
          ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('case', 'alternative_travel_ban', {
          transaction: t,
        }),
        queryInterface
          .addColumn(
            'case',
            'rejecting',
            {
              type: Sequelize.BOOLEAN,
              allowNull: true,
            },
            {
              transaction: t,
            },
          )
          .then(() =>
            queryInterface.sequelize.query(
              `UPDATE "case" SET rejecting = TRUE WHERE decision = 'REJECTING';`,
              { transaction: t },
            ),
          )
          .then(() =>
            queryInterface.removeColumn('case', 'decision', {
              transaction: t,
            }),
          )
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_decision";',
              { transaction: t },
            ),
          ),
      ]),
    )
  },
}
