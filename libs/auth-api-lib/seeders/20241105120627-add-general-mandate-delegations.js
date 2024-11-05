'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.query(`
    BEGIN;

      INSERT INTO delegation (
        id,
        to_national_id,
        to_name,
        from_national_id,
        from_display_name,
        domain_name,
      reference_id
      ) VALUES (
        uuid_generate_v4(),
        '0101302399',
        'Gervimaður Færeyjar',
        '0101302989',
        'Gervimaður Ameríku',
        null,
        123
      ), (
        uuid_generate_v4(),
        '0101305069',
        'Gervimaður Bandaríkin',
        '0101304929',
        'Gervimaður Bretland',
        null,
        345
      );

      INSERT INTO delegation_delegation_type (
          delegation_id,
          delegation_type_id
      ) VALUES (
          (select id from delegation where to_national_id = '0101302399' AND from_national_id = '0101302989' AND domain_name is null),
          'GeneralMandate'
      ), (
      (select id from delegation where to_national_id = '0101305069' AND from_national_id = '0101304929' AND domain_name is null),
          'GeneralMandate'
      );

      COMMIT;
    `)
  },

  async down(queryInterface, Sequelize) {
    // Only need to remove from delegation table as the rest will be removed by cascade
    queryInterface.sequelize.query(`
      BEGIN;

        DELETE FROM delegation
        WHERE to_national_id = '0101302399' AND from_national_id = '0101302989' AND domain_name is null
        OR to_national_id = '0101305069' AND from_national_id = '0101304929' AND domain_name is null;

      COMMIT;
    `)
  },
}
