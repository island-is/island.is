'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
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
      })
        .then(() => {
          queryInterface.bulkInsert(
            'institution',
            [
              {
                id: 'c9b3b124-2a85-11ec-8d3d-0242ac130003',
                name: 'Fangelsismálastofnun ríkisins',
                type: 'PRISON_ADMIN',
                active: true,
              },
              {
                id: 'c9b3b3ae-2a85-11ec-8d3d-0242ac130003',
                name: 'Fangelsið Hólmsheiði',
                type: 'PRISON',
                active: true,
              },
            ],
            { transaction: t },
          )
        })
        .then(() => {
          return replaceEnum({
            queryInterface,
            tableName: 'user',
            columnName: 'role',
            newValues: ['PROSECUTOR', 'JUDGE', 'REGISTRAR', 'STAFF'],
          })
        }),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      replaceEnum({
        queryInterface,
        tableName: 'institution',
        columnName: 'type',
        newValues: ['PROSECUTORS_OFFICE', 'COURT', 'HIGH_COURT'],
        enumName: 'enum_institution_type',
      })
        .then(() => {
          queryInterface.bulkDelete(
            'institution',
            {
              id: [
                'c9b3b124-2a85-11ec-8d3d-0242ac130003',
                'c9b3b3ae-2a85-11ec-8d3d-0242ac130003',
              ],
            },
            { transaction: t },
          )
        })
        .then(() => {
          return replaceEnum({
            queryInterface,
            tableName: 'user',
            columnName: 'role',
            newValues: ['PROSECUTOR', 'JUDGE', 'REGISTRAR'],
          })
        }),
    )
  },
}
