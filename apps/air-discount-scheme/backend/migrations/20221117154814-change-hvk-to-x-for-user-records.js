'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        SET user_info = jsonb_set(user_info, '{gender}', '"x"')
        WHERE user_info ->> 'gender' = 'hvk';
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        SET user_info = jsonb_set(user_info, '{gender}', '"hvk"')
        WHERE user_info ->> 'gender' = 'x';
    COMMIT;
    `)
  },
}
