'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query('SELECT id, name FROM case_file', { transaction: t })
        .then((res) =>
          Promise.all(
            res[0].map(async (c) => {
              queryInterface.sequelize.query(
                `UPDATE case_file SET name = '${c.name.normalize()}' \
                 WHERE id = '${c.id}'`,
                { transaction: t },
              )
            }),
          ),
        ),
    )
  },

  down: async () => {
    // no need to roll back
    return
  },
}
