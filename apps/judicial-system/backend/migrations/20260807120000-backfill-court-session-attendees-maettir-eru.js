'use strict'

// After making "Mættir eru" part of the editable attendees text (and removing
// the fixed PDF heading), existing court_session rows still store names only.
// Prepend the same prefix the UI now uses on init so old PDFs keep the heading.

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
        UPDATE court_session
        SET attendees = 'Mættir eru:' || CHR(10) || attendees
        WHERE attendees IS NOT NULL
          AND BTRIM(attendees, E' \t\n\r') <> ''
          AND BTRIM(attendees, E' \t\n\r') NOT LIKE 'Mættir eru%'
        `,
        { transaction },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
