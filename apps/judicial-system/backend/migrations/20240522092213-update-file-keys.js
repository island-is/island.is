'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
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
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
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
    )
  },
}
