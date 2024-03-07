'use strict'

//add mileage change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX idx_recycling_partner_company_id ON recycling_partner(company_id);
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP INDEX idx_recycling_partner_company_id;
    `)
  },
}
