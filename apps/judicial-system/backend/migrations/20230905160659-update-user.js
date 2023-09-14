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
        'PROSECUTOR_REPRESENTATIVE',
        'JUDGE',
        'REGISTRAR',
        'ASSISTANT',
        'STAFF',
        'PRISON_SYSTEM_STAFF',
      ],
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          queryInterface.sequelize.query(
            `UPDATE "user" SET role = 'PRISON_SYSTEM_STAFF'
               WHERE role = 'STAFF'`,
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
            'PRISON_SYSTEM_STAFF',
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
        'PROSECUTOR_REPRESENTATIVE',
        'JUDGE',
        'REGISTRAR',
        'ASSISTANT',
        'STAFF',
        'PRISON_SYSTEM_STAFF',
      ],
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          Promise.all([
            queryInterface.sequelize.query(
              `UPDATE "user" SET role = 'STAFF'
               WHERE role = 'PRISON_SYSTEM_STAFF'`,
              { transaction },
            ),
          ]),
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
}
