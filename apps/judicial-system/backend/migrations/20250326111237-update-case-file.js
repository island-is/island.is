'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case_file',
          'hash_algorithm',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'subpoena',
          'hash_algorithm',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'indictment_hash_algorithm',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]).then(() =>
        queryInterface.sequelize.query(
          `
          BEGIN;

          UPDATE "case_file"
          SET "hash_algorithm" = 'MD5' 
          WHERE "hash" is not null;

          UPDATE "subpoena"
          SET "hash_algorithm" = 'MD5' 
          WHERE "hash" is not null;

          UPDATE "case"
          SET "indictment_hash_algorithm" = 'MD5' 
          WHERE "indictment_hash" is not null;

          COMMIT;
          `,
          { transaction: t },
        ),
      ),
    )
  },
  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('case_file', 'hash_algorithm', {
          transaction: t,
        }),
        queryInterface.removeColumn('subpoena', 'hash_algorithm', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'indictment_hash_algorithm', {
          transaction: t,
        }),
      ]),
    )
  },
}
