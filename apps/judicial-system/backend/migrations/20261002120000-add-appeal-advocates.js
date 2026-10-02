'use strict'

// The lawyers of the appeal proceeding, kept apart from the lawyers of the
// district court proceeding.
//
// A defendant already carries appeal_defender_* and is_appeal_defender_confirmed,
// written when the public prosecution office registers an appeal arriving by
// letter. What was missing is the defendant declining counsel for the appeal,
// and the whole of the civil claimant's side, which mirrors the district court
// columns one for one.
const civilClaimantColumns = [
  ['has_appeal_spokesperson', 'BOOLEAN'],
  ['appeal_spokesperson_is_lawyer', 'BOOLEAN'],
  ['appeal_spokesperson_national_id', 'STRING'],
  ['appeal_spokesperson_name', 'STRING'],
  ['appeal_spokesperson_email', 'STRING'],
  ['appeal_spokesperson_phone_number', 'STRING'],
  ['is_appeal_spokesperson_confirmed', 'BOOLEAN'],
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        // Null until the court of appeals records a stance, so that "no answer
        // yet" and "wants no counsel" stay apart.
        queryInterface.addColumn(
          'defendant',
          'appeal_defender_waived',
          { type: Sequelize.BOOLEAN, allowNull: true },
          { transaction: t },
        ),
        ...civilClaimantColumns.map(([name, type]) =>
          queryInterface.addColumn(
            'civil_claimant',
            name,
            { type: Sequelize[type], allowNull: true },
            { transaction: t },
          ),
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('defendant', 'appeal_defender_waived', {
          transaction: t,
        }),
        ...civilClaimantColumns.map(([name]) =>
          queryInterface.removeColumn('civil_claimant', name, {
            transaction: t,
          }),
        ),
      ]),
    )
  },
}
