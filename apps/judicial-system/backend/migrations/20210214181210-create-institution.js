'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .createTable(
          'institution',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            created: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            modified: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            name: {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
            },
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.bulkInsert(
            'institution',
            [
              {
                id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
                name: 'Héraðsdómur Reykjavíkur',
              },
              {
                id: '53581d7b-0591-45e5-9cbe-c96b2f82da85',
                name: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                id: 'fbbe0ebd-33f1-4a8f-84ba-8e4b8e8b16b1',
                name: 'Héraðssaksóknari',
              },
              {
                id: 'a38666f3-0444-4e44-9654-b83f39f4db11',
                name: 'Bráðabirgðadómstóllinn',
              },
              {
                id: '7b261673-8990-46b4-a310-5412ad77686a',
                name: 'Bráðabirgðalögreglustjórinn',
              },
            ],
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.changeColumn(
            'institution',
            'name',
            {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
            },
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'user',
            'institution_id',
            {
              type: Sequelize.UUID,
              references: {
                model: 'institution',
                key: 'id',
              },
              allowNull: true,
            },
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "user" \
             SET "institution_id" = "i"."id" \
             FROM (SELECT "id", "name" \
                   FROM "institution") as "i" \
             WHERE "user"."institution" = "i"."name"`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('user', 'institution', {
            transaction: t,
          }),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'user',
          'institution',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "user" \
             SET "institution" = "i"."name" \
             FROM (SELECT "id", "name" \
                   FROM "institution") as "i" \
             WHERE "user"."institution_id" = "i"."id"`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.changeColumn(
            'user',
            'institution',
            {
              type: Sequelize.STRING,
              allowNull: false,
            },
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('user', 'institution_id', {
            transaction: t,
          }),
        )
        .then(() =>
          queryInterface.dropTable('institution', { transaction: t }),
        ),
    )
  },
}
