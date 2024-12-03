//add number plate & deregistered info change
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE recycling_partner ADD COLUMN is_municipality BOOLEAN;
        ALTER TABLE recycling_partner ADD COLUMN municipality_id VARCHAR;
        CREATE INDEX idx_recycling_partner_is_municipality ON recycling_partner(is_municipality);
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE recycling_partner DROP COLUMN is_municipality;
      ALTER TABLE recycling_partner DROP COLUMN municipality_id;
      DROP INDEX idx_recycling_partner_is_municipality;
    `)
  },
}
