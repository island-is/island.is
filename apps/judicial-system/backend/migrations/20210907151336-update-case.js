'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `UPDATE "case" \
         SET ruling_date = court_end_time
         WHERE state in ('ACCEPTED', 'REJECTED') AND ruling_date is NULL`,
        {
          transaction: t,
        },
      ),
    )
  },

  down: async () => {
    // no need to roll back
    return
  },
}
