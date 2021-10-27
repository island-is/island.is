'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_applications_state";',
          { transaction: t },
        ),
        queryInterface.removeColumn('applications', 'state', { transaction: t }),
        queryInterface.addColumn(
          'applications',
          'state',
          {
            type: Sequelize.ENUM(
              'New',
              'InProgress',
              'DataNeeded',
              'Rejected',
              'Approved',
            ),
            allowNull: false,
            defaultValue: 'New',
          },
          { transaction: t },
        ),
    ]),
  )
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
      queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_applications_state";',
        { transaction: t },
      ),
      queryInterface.changeColumn('applications', 'state', {
        type: Sequelize.TEXT,
      }),
  ]),
  )

  }
}
