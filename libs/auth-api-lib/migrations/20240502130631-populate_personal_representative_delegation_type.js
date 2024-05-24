'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      BEGIN;

      INSERT INTO personal_representative_delegation_type (id, personal_representative_id, delegation_type_id, created) SELECT p.id, p.personal_representative_id, d.id, p.created FROM personal_representative_right p JOIN delegation_type d ON d.id = 'PersonalRepresentative:' || p.right_type_code;

      COMMIT;
      `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      BEGIN;

      DELETE FROM personal_representative_delegation_type;

      COMMIT;
    `)
  },
}
