'use strict'

// Actor snapshot on appeal events (same shape as event_log) so "who did what"
// survives prosecutor/defender reassignment. These columns - together with the
// existing user_role - describe the human who performed the event. user_id is
// the system user that acted; it is NULL for defenders (who are not system
// users), for whom national_id/user_name identify the actor instead.
const STRING_COLUMNS = [
  'national_id',
  'user_name',
  'user_title',
  'institution_name',
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        ...STRING_COLUMNS.map((column) =>
          queryInterface.addColumn(
            'appeal_event_log',
            column,
            { type: Sequelize.STRING, allowNull: true },
            { transaction },
          ),
        ),
        queryInterface.addColumn(
          'appeal_event_log',
          'user_id',
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: { model: 'user', key: 'id' },
          },
          { transaction },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all(
        [...STRING_COLUMNS, 'user_id'].map((column) =>
          queryInterface.removeColumn('appeal_event_log', column, {
            transaction,
          }),
        ),
      ),
    )
  },
}
