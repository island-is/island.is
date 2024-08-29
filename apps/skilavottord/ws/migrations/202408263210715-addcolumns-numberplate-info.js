'use strict'

//add number plate & deregistered info change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE vehicle ADD COLUMN plate_count INT;
        ALTER TABLE vehicle ADD COLUMN plate_lost INT;
        ALTER TABLE vehicle ADD COLUMN plate_destroyed INT;
        ALTER TABLE vehicle ADD COLUMN deregistered BOOLEAN;
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE vehicle DROP COLUMN plate_count;
      ALTER TABLE vehicle DROP COLUMN plate_lost;
      ALTER TABLE vehicle DROP COLUMN plate_destroyed;
      ALTER TABLE vehicle DROP COLUMN deregistered;
    `)
  },
}
