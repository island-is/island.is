'use strict'

// Adds an is_pronounced_orally column to case_file.
//
// A ruling under the course of a case (úrskurður undir rekstri máls) is usually
// pronounced orally in the court session and only written up as a document if a
// party appeals it. Such a ruling exists as a COURT_INDICTMENT_RULING_ORDER
// case file from the moment it is pronounced - the court record links to it,
// the parties' appeal decisions and any appeal key on it - but it has no
// document behind it until the district court uploads one.
//
// The column records how the ruling was pronounced, so it stays true after the
// document has been uploaded. Whether a document exists is a separate question,
// answered by the key being empty.
//
// NULL for every other case file, including ruling orders that were uploaded
// before being pronounced.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case_file',
        'is_pronounced_orally',
        { type: Sequelize.BOOLEAN, allowNull: true },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case_file', 'is_pronounced_orally', {
        transaction,
      }),
    )
  },
}
