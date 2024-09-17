//add mileage change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX idx_recycling_partner_company_id ON recycling_partner(company_id);
        CREATE INDEX idx_vehicle_owner_national_id ON vehicle_owner(national_id);
        CREATE INDEX idx_vehicle_id ON vehicle(vehicle_id);
        CREATE INDEX idx_request_vehicle_id ON recycling_request(vehicle_id);
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP INDEX idx_recycling_partner_company_id;
      DROP INDEX idx_vehicle_owner_national_id;
      DROP INDEX idx_vehicle_id;
      DROP INDEX idx_request_vehicle_id;
    `)
  },
}
