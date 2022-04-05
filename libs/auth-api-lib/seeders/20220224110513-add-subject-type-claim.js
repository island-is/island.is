'use strict'
/* eslint-env node */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        insert into identity_resource_user_claim
        (identity_resource_name, claim_name)
        values
        ('openid', 'subjectType');
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        delete from identity_resource_user_claim
        where identity_resource_name = 'openid' and claim_name = 'subjectType';
      COMMIT;
    `)
  },
}
