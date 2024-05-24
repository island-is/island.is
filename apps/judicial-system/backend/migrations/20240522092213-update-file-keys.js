'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize.query(
          `UPDATE case_file
         SET key = SUBSTRING(key FROM 9)
         WHERE key LIKE 'uploads/' || '%';
         UPDATE case_file
         SET key = SUBSTRING(key FROM 23)
         WHERE key LIKE 'indictments/completed/' || '%';
         UPDATE case_file
         SET key = SUBSTRING(key FROM 13)
         WHERE key LIKE 'indictments/' || '%';`,
          { transaction },
        ),
        queryInterface.addColumn(
          'case',
          'indictment_hash',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        ),
        queryInterface.addColumn(
          'case_file',
          'hash',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize.query(
          `UPDATE case_file
         SET key = 'uploads/' || key
         WHERE key IS NOT NULL AND case_id IN (
           SELECT id
           FROM "case"
           WHERE type != 'INDICTMENT'
         );
         UPDATE case_file
         SET key = 'indictments/completed/' || key
         WHERE key IS NOT NULL AND case_id IN (
           SELECT id
           FROM "case"
           WHERE type = 'INDICTMENT' AND state = 'COMPLETED'
         );
         UPDATE case_file
         SET key = 'indictments/' || key
         WHERE key IS NOT NULL AND case_id IN (
           SELECT id
           FROM "case"
           WHERE type = 'INDICTMENT' AND state != 'COMPLETED'
         );`,
          { transaction },
        ),
        queryInterface.removeColumn('case', 'indictment_hash', { transaction }),
        queryInterface.removeColumn('case_file', 'hash', { transaction }),
      ]),
    )
  },
}
