'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;
        -- Update all PersonalRepresentative delegation types to be owned by syslumenn provider
        UPDATE delegation_type
        SET provider = 'syslumenn'
        WHERE id LIKE 'PersonalRepresentative:%';

      COMMIT;
    `)
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      BEGIN;
        -- Revert all PersonalRepresentative delegation types back to talsmannagrunnur provider
        UPDATE delegation_type
        SET provider = 'talsmannagrunnur'
        WHERE id LIKE 'PersonalRepresentative:%';

      COMMIT;
    `)
  },
}
