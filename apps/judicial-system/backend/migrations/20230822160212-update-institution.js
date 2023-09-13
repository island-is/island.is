'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'institution',
      columnName: 'type',
      newValues: [
        'PROSECUTORS_OFFICE',
        'COURT',
        'HIGH_COURT',
        'DISTRICT_COURT',
        'COURT_OF_APPEALS',
        'PRISON',
        'PRISON_ADMIN',
      ],
      enumName: 'enum_institution_type',
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          Promise.all([
            queryInterface.sequelize.query(
              `UPDATE institution SET type = 'DISTRICT_COURT'
               WHERE type = 'COURT'`,
              { transaction },
            ),
            queryInterface.sequelize.query(
              `UPDATE institution SET type = 'COURT_OF_APPEALS'
               WHERE type = 'HIGH_COURT'`,
              { transaction },
            ),
          ]),
        ),
      )
      .then(() =>
        // replaceEnum does not support transactions
        replaceEnum({
          queryInterface,
          tableName: 'institution',
          columnName: 'type',
          newValues: [
            'PROSECUTORS_OFFICE',
            'DISTRICT_COURT',
            'COURT_OF_APPEALS',
            'PRISON',
            'PRISON_ADMIN',
          ],
          enumName: 'enum_institution_type',
        }),
      )
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'institution',
      columnName: 'type',
      newValues: [
        'PROSECUTORS_OFFICE',
        'COURT',
        'HIGH_COURT',
        'DISTRICT_COURT',
        'COURT_OF_APPEALS',
        'PRISON',
        'PRISON_ADMIN',
      ],
      enumName: 'enum_institution_type',
    })
      .then(() =>
        queryInterface.sequelize.transaction((transaction) =>
          Promise.all([
            queryInterface.sequelize.query(
              `UPDATE institution SET type = 'COURT'
               WHERE type = 'DISTRICT_COURT'`,
              { transaction },
            ),
            queryInterface.sequelize.query(
              `UPDATE institution SET type = 'HIGH_COURT'
               WHERE type = 'COURT_OF_APPEALS'`,
              { transaction },
            ),
          ]),
        ),
      )
      .then(() =>
        // replaceEnum does not support transactions
        replaceEnum({
          queryInterface,
          tableName: 'institution',
          columnName: 'type',
          newValues: [
            'PROSECUTORS_OFFICE',
            'COURT',
            'HIGH_COURT',
            'PRISON',
            'PRISON_ADMIN',
          ],
          enumName: 'enum_institution_type',
        }),
      )
  },
}
