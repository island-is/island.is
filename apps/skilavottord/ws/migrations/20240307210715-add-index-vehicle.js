'use strict'

//add mileage change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE INDEX idx_vehicle_id ON vehicle(vehicle_id);
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP INDEX idx_vehicle_id;
    `)
  },
}
