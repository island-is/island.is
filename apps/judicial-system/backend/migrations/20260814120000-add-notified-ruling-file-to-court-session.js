'use strict'

// The ruling order pronounced in a court session is announced to the parties
// when the court record is confirmed. Correcting a confirmed court record and
// confirming it again repeats that confirmation, which announced the same
// ruling all over again. This column records the ruling that has already been
// announced, so the announcement only happens once per pronounced ruling.
//
// Deliberately not a foreign key: it records what was announced, so it must
// survive the file being deleted - and unlike ruling_file_id it must not block
// that deletion.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'court_session',
        'notified_ruling_file_id',
        { type: Sequelize.UUID, allowNull: true },
        { transaction: t },
      )

      // Every ruling order pronounced in an already confirmed court session has
      // been announced under the old behaviour. Without this backfill the first
      // correction of each of them after this deployment would announce it again
      // - precisely what the column exists to prevent.
      await queryInterface.sequelize.query(
        `UPDATE court_session
         SET notified_ruling_file_id = ruling_file_id
         WHERE is_confirmed = true
           AND ruling_type = 'ORDER'
           AND ruling_file_id IS NOT NULL`,
        { transaction: t },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('court_session', 'notified_ruling_file_id', {
        transaction: t,
      }),
    )
  },
}
