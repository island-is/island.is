'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        /* fix wrong customer entry AEY RKV*/
        UPDATE flight_leg
        SET date = '2021-04-29T12:45:00.000Z'
        WHERE id = 'd809e68a-2ce0-4249-928c-aac2cd939a0f';

        /* fix wrong customer entry RKV AEY*/
        UPDATE flight_leg
        SET date = '2021-05-02T14:20:00.000Z'
        WHERE id = '556cd4bc-e49b-43ba-bbc9-3659ad7c61eb';
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      /* unfix wrong customer entry AEY RKV*/
      UPDATE flight_leg
      SET date = '2021-04-26T19:53:49.605Z'
      WHERE id = 'd809e68a-2ce0-4249-928c-aac2cd939a0f';

      /* unfix wrong customer entry AEY RKV*/
      UPDATE flight_leg
      SET date = '2021-04-26T19:53:49.605Z'
      WHERE id = '556cd4bc-e49b-43ba-bbc9-3659ad7c61eb';
    COMMIT;
    `)
  },
}
