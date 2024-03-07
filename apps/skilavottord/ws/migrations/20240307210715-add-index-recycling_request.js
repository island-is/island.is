'use strict'

//add mileage change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX idx_request_vehicle_id ON recycling_request(vehicle_id);
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP INDEX idx_request_vehicle_id;
    `)
  },
}
