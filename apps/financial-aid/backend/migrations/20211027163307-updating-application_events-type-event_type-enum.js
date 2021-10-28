'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('application_events', 'event_type', { transaction: t })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_application_events_event_type;',
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'application_events',
            'event_type',
            {
              type: Sequelize.ENUM(
                'New',
                'InProgress',
                'DataNeeded',
                'Rejected',
                'Approved',
                'StaffComment',
                'UserComment',
                'FileUpload',
                'AssignCase'
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
        .changeColumn('application_events', 'event_type', {
          type: Sequelize.TEXT,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_application_events_event_type;',
            { transaction: t },
          ),
        ),
    )
  },
}
