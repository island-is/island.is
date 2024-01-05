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
        'DISTRICT_COURT_JUDGE',
        'DISTRICT_COURT_REGISTRAR',
        'DISTRICT_COURT_ASSISTANT',
        'COURT_OF_APPEALS_JUDGE',
        'COURT_OF_APPEALS_REGISTRAR',
        'COURT_OF_APPEALS_ASSISTANT',
        'PRISON_SYSTEM_STAFF',
      ],
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          queryInterface.sequelize.query(
            `UPDATE "user" SET role = 'COURT_OF_APPEALS_JUDGE'
               WHERE role = 'JUDGE' AND institution_id = '4676f08b-aab4-4b4f-a366-697540788088';
             UPDATE "user" SET role = 'COURT_OF_APPEALS_REGISTRAR'
               WHERE role = 'REGISTRAR' AND institution_id = '4676f08b-aab4-4b4f-a366-697540788088';
             UPDATE "user" SET role = 'COURT_OF_APPEALS_ASSISTANT'
               WHERE role = 'ASSISTANT' AND institution_id = '4676f08b-aab4-4b4f-a366-697540788088';
             UPDATE "user" SET role = 'DISTRICT_COURT_JUDGE'
               WHERE role = 'JUDGE';
             UPDATE "user" SET role = 'DISTRICT_COURT_REGISTRAR'
               WHERE role = 'REGISTRAR';
             UPDATE "user" SET role = 'DISTRICT_COURT_ASSISTANT'
               WHERE role = 'ASSISTANT';`,
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
            'DISTRICT_COURT_JUDGE',
            'DISTRICT_COURT_REGISTRAR',
            'DISTRICT_COURT_ASSISTANT',
            'COURT_OF_APPEALS_JUDGE',
            'COURT_OF_APPEALS_REGISTRAR',
            'COURT_OF_APPEALS_ASSISTANT',
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
        'DISTRICT_COURT_JUDGE',
        'DISTRICT_COURT_REGISTRAR',
        'DISTRICT_COURT_ASSISTANT',
        'COURT_OF_APPEALS_JUDGE',
        'COURT_OF_APPEALS_REGISTRAR',
        'COURT_OF_APPEALS_ASSISTANT',
        'PRISON_SYSTEM_STAFF',
      ],
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          queryInterface.sequelize.query(
            `UPDATE "user" SET role = 'JUDGE'
               WHERE role = 'COURT_OF_APPEALS_JUDGE';
             UPDATE "user" SET role = 'REGISTRAR'
               WHERE role = 'COURT_OF_APPEALS_REGISTRAR';
             UPDATE "user" SET role = 'ASSISTANT'
               WHERE role = 'COURT_OF_APPEALS_ASSISTANT';
             UPDATE "user" SET role = 'JUDGE'
               WHERE role = 'DISTRICT_COURT_JUDGE';
             UPDATE "user" SET role = 'REGISTRAR'
               WHERE role = 'DISTRICT_COURT_REGISTRAR';
             UPDATE "user" SET role = 'ASSISTANT'
               WHERE role = 'DISTRICT_COURT_ASSISTANT';`,
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
}
