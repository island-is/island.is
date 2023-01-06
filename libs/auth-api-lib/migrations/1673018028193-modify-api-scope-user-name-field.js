'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize.query(
          `
          UPDATE api_scope_user
          SET name = 'NAME_NOT_SET'
          WHERE name IS NULL`,
          { transaction },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.sequelize.query(
          `
          UPDATE api_scope_user
          SET name = NULL
          WHERE name = 'NAME_NOT_SET'`,
          { transaction },
        ),
      ]),
    )
  },
}
