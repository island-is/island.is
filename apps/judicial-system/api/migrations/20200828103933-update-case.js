'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'police_case_number', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
      queryInterface.addColumn('case', 'suspect_national_id', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
      queryInterface.addColumn('case', 'suspect_name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
      queryInterface.addColumn('case', 'state', {
        type: Sequelize.ENUM(
          'UNKNOWN',
          'DRAFT',
          'SUBMITTED',
          'ACTIVE',
          'COMPLETED',
        ),
        allowNull: false,
        defaultValue: 'DRAFT',
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'police_case_number'),
      queryInterface.removeColumn('case', 'suspect_national_id'),
      queryInterface.removeColumn('case', 'suspect_name'),
      queryInterface.removeColumn('case', 'state'),
    ])
  },
}
