'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'case',
          { state: 'RECEIVED' },
          { state: 'MAIN_HEARING' },
          { transaction },
        ),
        queryInterface.bulkUpdate(
          'case_file',
          { category: 'CASE_FILE' },
          { category: 'COVER_LETTER' },
          { transaction },
        ),
      ]),
    )
  },

  async down() {
    // Nothing to do here
    return
  },
}
