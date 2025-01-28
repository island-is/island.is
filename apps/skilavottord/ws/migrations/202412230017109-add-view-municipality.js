module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
     CREATE VIEW municipality_view AS 
      SELECT company_id AS "id", company_name AS "company_name", address, postnumber, city, email, phone, website, active 
      FROM recycling_partner 
      WHERE is_municipality = true;
    `)
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP VIEW IF EXISTS municipality_view
    `)
  },
}
