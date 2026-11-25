'use strict'

/**
 * The generic '@island.is/applications/directorate-of-equality' scope now only
 * covers the equality report, the salary report has a scope of its own.
 */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE public.api_scope
        SET description = 'Skil á jafnréttisáætlun'
        WHERE name = '@island.is/applications/directorate-of-equality';
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE public.api_scope
        SET description = 'Umsóknir hjá Jafnréttisstofu'
        WHERE name = '@island.is/applications/directorate-of-equality';
    `)
  },
}
