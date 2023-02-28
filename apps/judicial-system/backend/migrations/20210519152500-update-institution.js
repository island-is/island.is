'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'institution',
          'type',
          {
            type: Sequelize.ENUM('PROSECUTORS_OFFICE', 'COURT'),
            allowNull: false,
            defaultValue: 'PROSECUTORS_OFFICE',
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'institution',
          'active',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          { transaction: t },
        ),
      ]).then(() =>
        Promise.all([
          queryInterface.sequelize.query(
            `ALTER TABLE "institution" ALTER COLUMN "type" DROP DEFAULT;`,
            { transaction: t },
          ),
          queryInterface.sequelize.query(
            `ALTER TABLE "institution" ALTER COLUMN "active" DROP DEFAULT;`,
            { transaction: t },
          ),
          queryInterface.bulkUpdate(
            'institution',
            { type: 'COURT' },
            {
              id: [
                'a38666f3-0444-4e44-9654-b83f39f4db11',
                'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
              ],
            },
            { transaction: t },
          ),
          queryInterface.bulkUpdate(
            'institution',
            { active: false },
            {
              id: [
                'a38666f3-0444-4e44-9654-b83f39f4db11',
                '7b261673-8990-46b4-a310-5412ad77686a',
              ],
            },
            { transaction: t },
          ),
          queryInterface.bulkInsert(
            'institution',
            [
              {
                id: '9acb7d8e-426c-45a3-b3ef-5657bab629a3',
                name: 'Héraðsdómur Vesturlands',
                type: 'COURT',
                active: false,
              },
              {
                id: 'e997eb13-9963-46ef-b1d8-6b806a1965eb',
                name: 'Héraðsdómur Vestfjarða',
                type: 'COURT',
                active: false,
              },
              {
                id: '7299ab8f-2fcc-40be-8194-8c2f749b4791',
                name: 'Héraðsdómur Norðurlands vestra',
                type: 'COURT',
                active: false,
              },
              {
                id: 'c98547fd-cc63-408c-815a-9c5d33ee5ba0',
                name: 'Héraðsdómur Norðurlands eystra',
                type: 'COURT',
                active: false,
              },
              {
                id: '73ef0f01-7ae6-477c-af4a-9e86c2bc3440',
                name: 'Héraðsdómur Austurlands',
                type: 'COURT',
                active: false,
              },
              {
                id: 'c9a51c9a-c0e3-4c1f-a9a2-828a3af05d1d',
                name: 'Héraðsdómur Reykjaness',
                type: 'COURT',
                active: true,
              },
            ],
            { transaction: t },
          ),
        ]),
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .removeColumn('institution', 'type', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_institution_type";',
              { transaction: t },
            ),
          ),
        queryInterface.removeColumn('institution', 'active', {
          transaction: t,
        }),
        queryInterface.bulkDelete(
          'institution',
          {
            id: [
              '9acb7d8e-426c-45a3-b3ef-5657bab629a3',
              'e997eb13-9963-46ef-b1d8-6b806a1965eb',
              '7299ab8f-2fcc-40be-8194-8c2f749b4791',
              'c98547fd-cc63-408c-815a-9c5d33ee5ba0',
              '73ef0f01-7ae6-477c-af4a-9e86c2bc3440',
              'c9a51c9a-c0e3-4c1f-a9a2-828a3af05d1d',
            ],
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
