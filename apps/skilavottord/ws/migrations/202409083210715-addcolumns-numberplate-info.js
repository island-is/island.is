//add number plate & deregistered info change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE vehicle ADD COLUMN plate_count INT;
        ALTER TABLE vehicle ADD COLUMN plate_lost BOOLEAN;
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE vehicle DROP COLUMN plate_count;
      ALTER TABLE vehicle DROP COLUMN plate_lost;
    `)
  },
}
