'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'accused_bookings',
          { type: Sequelize.TEXT, allowNull: true },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `SELECT id, type, session_arrangements, is_accused_rights_hidden, accused_plea_decision, accused_plea_announcement FROM "case" WHERE state in ('ACCEPTED', 'REJECTED', 'DISMISSED')`,
            { transaction: t },
          ),
        )
        .then((res) =>
          Promise.all(
            res[0].map((c) => {
              let accusedBookings = ''
              if (c.type === 'CUSTODY' || c.type === 'TRAVEL_BAN') {
                if (!c.is_accused_rights_hidden) {
                  accusedBookings +=
                    'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.\n\nSakborningi er kynnt krafa á dómskjali nr. 1.\n\n'
                }
                if (c.accused_plea_decision === 'ACCEPT') {
                  accusedBookings += 'Sakborningur samþykkir kröfuna. '
                }
                if (c.accused_plea_decision === 'REJECT') {
                  accusedBookings += 'Sakborningur mótmælir kröfunni. '
                }
                accusedBookings += c.accused_plea_announcement ?? ''
                return queryInterface.sequelize.query(
                  `UPDATE "case" set accused_bookings = '${accusedBookings.replace(
                    /'/g,
                    "''",
                  )}' WHERE id = '${c.id}'`,
                  {
                    transaction: t,
                  },
                )
              } else {
                if (
                  c.session_arrangements === 'ALL_PRESENT' &&
                  !c.is_accused_rights_hidden
                ) {
                  accusedBookings +=
                    'Varnaraðila er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Varnaraðili er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.\n\nVarnaraðila er kynnt krafa á dómskjali nr. 1.\n\n'
                }
                if (c.accused_plea_decision !== 'NOT_APPLICABLE') {
                  if (c.accused_plea_decision === 'ACCEPT') {
                    accusedBookings += 'Varnaraðili samþykkir kröfuna. '
                  }
                  if (c.accused_plea_decision === 'REJECT') {
                    accusedBookings += 'Varnaraðili mótmælir kröfunni. '
                  }
                  accusedBookings += c.accused_plea_announcement ?? ''
                }
                return queryInterface.sequelize.query(
                  `UPDATE "case" set accused_bookings = '${accusedBookings.replace(
                    /'/g,
                    "''",
                  )}' WHERE id = '${c.id}'`,
                  {
                    transaction: t,
                  },
                )
              }
            }),
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'accused_bookings', {
        transaction: t,
      }),
    )
  },
}
