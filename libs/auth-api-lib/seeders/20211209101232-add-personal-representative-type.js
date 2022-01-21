'use strict'
/* eslint-env node */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        insert into personal_representative_type(
          code, 
          name, 
          description
        ) 
        values (
          'personal_representative_for_disabled_person', 
          'Persónulegur talsmaður fatlaðs einstaklings',
          'Persónulegur talsmaður fatlaðs einstaklings samkvæmt reglugerð 972/2012'
        );
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        delete from personal_representative_type
         where code = 'personal_representative_for_disabled_person';
      COMMIT;
    `)
  },
}
