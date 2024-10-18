module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE delegation_type
          SET actor_discretion_required = true
          WHERE id = 'LegalRepresentative';

      COMMIT;
    `)
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE delegation_type
          SET actor_discretion_required = false
          WHERE id = 'LegalRepresentative';

      COMMIT;
    `)
  },
}
