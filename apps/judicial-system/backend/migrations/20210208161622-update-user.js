'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: ['PROSECUTOR', 'REGISTRAR', 'JUDGE', 'ADMIN'],
      enumName: 'enum_user_role',
    })
  },

  down: (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: ['PROSECUTOR', 'REGISTRAR', 'JUDGE'],
      enumName: 'enum_user_role',
    })
  },
}
