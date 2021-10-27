'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_application_events_event_type" CASCADE;',
          { transaction: t },
        ),
        queryInterface.removeColumn('application_events', 'event_type', { transaction: t }),
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
        'DROP TYPE IF EXISTS "enum_application_events_event_type" CASCADE;',
        { transaction: t },
      ),
      queryInterface.changeColumn('application_events', 'event_type', {
        type: Sequelize.TEXT,
      }),
  ]),
  )
  }
};
