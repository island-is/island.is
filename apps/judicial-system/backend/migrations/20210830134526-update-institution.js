'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      // replaceEnum does not support transactions
      replaceEnum({
        queryInterface,
        tableName: 'institution',
        columnName: 'type',
        newValues: ['PROSECUTORS_OFFICE', 'COURT', 'HIGH_COURT'],
        enumName: 'enum_institution_type',
      }).then(() =>
        queryInterface.bulkInsert(
          'institution',
          [
            {
              id: '4676f08b-aab4-4b4f-a366-697540788088',
              name: 'Landsréttur',
              type: 'HIGH_COURT',
              active: true,
            },
          ],
          { transaction: t },
        ),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .transaction((t) =>
        queryInterface.bulkDelete(
          'institution',
          {
            id: ['4676f08b-aab4-4b4f-a366-697540788088'],
          },
          { transaction: t },
        ),
      )
      .then(() =>
        replaceEnum({
          queryInterface,
          tableName: 'institution',
          columnName: 'type',
          newValues: ['PROSECUTORS_OFFICE', 'COURT'],
          enumName: 'enum_institution_type',
        }),
      )
  },
}
