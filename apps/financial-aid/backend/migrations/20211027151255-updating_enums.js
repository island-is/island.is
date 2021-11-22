'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('applications', 'state', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_applications_state;',
            { transaction: t },
          ),
        )
        .then(() =>
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
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .changeColumn('applications', 'state', {
          type: Sequelize.TEXT,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_applications_state;',
            { transaction: t },
          ),
        ),
    )
  },
}
