'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'program',
          'application_period_open',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
          },
          {
            transaction: t,
          },
        ),
        queryInterface.addColumn(
          'program',
          'application_in_university_gateway',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          {
            transaction: t,
          },
        ),
      ])
    })
  },

  //Down will most likely result in loss of data as we are casting from FLOAT to INTEGER
  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('program', 'application_period_open', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'program',
          'application_in_university_gateway',
          { transaction: t },
        ),
      ])
    })
  },
}
