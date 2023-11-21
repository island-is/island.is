'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  async up(queryInterface) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: [
        'PROSECUTOR',
        'REPRESENTATIVE',
        'PROSECUTOR_REPRESENTATIVE',
        'JUDGE',
        'REGISTRAR',
        'ASSISTANT',
        'STAFF',
      ],
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          queryInterface.sequelize.query(
            `UPDATE "user" SET role = 'PROSECUTOR_REPRESENTATIVE'
               WHERE role = 'REPRESENTATIVE'`,
            { transaction },
          ),
        ),
      )
      .then(() =>
        // replaceEnum does not support transactions
        replaceEnum({
          queryInterface,
          tableName: 'user',
          columnName: 'role',
          newValues: [
            'PROSECUTOR',
            'PROSECUTOR_REPRESENTATIVE',
            'JUDGE',
            'REGISTRAR',
            'ASSISTANT',
            'STAFF',
          ],
        }),
      )
  },

  async down(queryInterface) {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'role',
      newValues: [
        'PROSECUTOR',
        'REPRESENTATIVE',
        'PROSECUTOR_REPRESENTATIVE',
        'JUDGE',
        'REGISTRAR',
        'ASSISTANT',
        'STAFF',
      ],
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          queryInterface.sequelize.query(
            `UPDATE "user" SET role = 'REPRESENTATIVE'
               WHERE role = 'PROSECUTOR_REPRESENTATIVE'`,
            { transaction },
          ),
        ),
      )
      .then(() =>
        // replaceEnum does not support transactions
        replaceEnum({
          queryInterface,
          tableName: 'user',
          columnName: 'role',
          newValues: [
            'PROSECUTOR',
            'REPRESENTATIVE',
            'JUDGE',
            'REGISTRAR',
            'ASSISTANT',
            'STAFF',
          ],
        }),
      )
  },
}
