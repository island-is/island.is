'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkUpdate(
        'case',
        {
          prosecutor_appeal_announcement: null,
          prosecutor_appeal_decision: 'ACCEPT',
          prosecutor_postponed_appeal_date: null,
          appeal_state: null,
          appeal_received_by_court_date: null,
        },
        {
          id: '4c91ffb7-164a-4688-8012-6156b875bbac',
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkUpdate(
        'case',
        {
          prosecutor_appeal_announcement:
            'Sækjandi kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi og krafa hans verði tekin til greina.',
          prosecutor_appeal_decision: 'APPEAL',
          appeal_received_by_court_date: '2025-06-24T14:13:41.479Z',
          appeal_state: 'APPEALED',
        },
        {
          id: '4c91ffb7-164a-4688-8012-6156b875bbac',
        },
        { transaction: t },
      ),
    )
  },
}
