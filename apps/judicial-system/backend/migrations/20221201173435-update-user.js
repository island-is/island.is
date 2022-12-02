'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface,) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: ['PROSECUTOR', 'REPRESENTATIVE', 'JUDGE', 'REGISTRAR', 'STAFF'],
    })
  },

  async down(queryInterface) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: ['PROSECUTOR', 'JUDGE', 'REGISTRAR', 'STAFF'],
    })
  }
};
