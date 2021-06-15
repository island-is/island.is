'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'court_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'institution',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" \
             SET "court_id" = "i"."id" \
             FROM (SELECT "id", "name" \
                   FROM "institution") as "i" \
             WHERE "case"."court" = "i"."name"`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('case', 'court', {
            transaction: t,
          }),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'court',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" \
             SET "court" = "i"."name" \
             FROM (SELECT "id", "name" \
                   FROM "institution") as "i" \
             WHERE "case"."court_id" = "i"."id"`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('case', 'court_id', {
            transaction: t,
          }),
        ),
    )
  },
}
