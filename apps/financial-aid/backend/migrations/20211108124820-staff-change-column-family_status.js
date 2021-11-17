'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        `UPDATE "applications" SET family_status = 'Married' WHERE family_status = 'Unknown' OR family_status = 'Single' OR family_status = 'NotInformed';`,
        { transaction: t },
      ),
    )
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'applications',
      columnName: 'family_status',
      defaultValue: 'NotCohabitation',
      newValues: [
        'NotCohabitation',
        'Cohabitation',
        'UnregisteredCohabitation',
        'Married',
        'MarriedNotLivingTogether',
      ],
      enumName: 'enum_applications_family_status',
    })
  },

  down: async (queryInterface, Sequelize) => {
    // no need to roll back
    return
  },
}
